"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  NumberInput,
  Notice,
  Progress,
  Segmented,
  Stat,
  downloadBlob,
  formatBytes,
  renameFile,
} from "./ui";

const MAX_SECONDS = 15;

interface Meta {
  duration: number; // NaN when the browser cannot tell (some WebM recordings)
  width: number;
  height: number;
}

interface GifResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  frames: number;
}

// Minimal shape of the parts of gifenc we use (the package ships no types).
interface GifStream {
  writeFrame(
    index: Uint8Array,
    width: number,
    height: number,
    opts: { palette?: number[][]; delay?: number; repeat?: number },
  ): void;
  finish(): void;
  bytes(): Uint8Array;
}
interface Gifenc {
  GIFEncoder: () => GifStream;
  quantize: (rgba: Uint8ClampedArray, maxColors: number) => number[][];
  applyPalette: (rgba: Uint8ClampedArray, palette: number[][]) => Uint8Array;
}

class Cancelled extends Error {}

function seekTo(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("The video stopped loading while reading frames."));
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("The browser took too long to read a frame. Try a shorter clip or another browser."));
    }, 10_000);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = t;
  });
}

function waitForData(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= 2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    video.addEventListener("loadeddata", () => resolve(), { once: true });
    video.addEventListener(
      "error",
      () => reject(new Error("This browser could not open the video for conversion.")),
      { once: true },
    );
  });
}

function num(s: string): number {
  return s.trim() === "" ? NaN : Number(s);
}

export default function VideoToGif() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [start, setStart] = useState("0");
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("480");
  const [fps, setFps] = useState("10");
  const [loop, setLoop] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GifResult | null>(null);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLVideoElement>(null);
  const cancelRef = useRef(false);

  // Object URLs are revoked when replaced or when the tool unmounts.
  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);
  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  const pick = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (!f.type.startsWith("video/") && !/\.(mp4|webm|mov|m4v|mkv)$/i.test(f.name)) {
      setError("That does not look like a video file. Pick an MP4, WebM or MOV.");
      return;
    }
    setError("");
    setResult(null);
    setMeta(null);
    setStart("0");
    setFile(f);
    setUrl(URL.createObjectURL(f));
  };

  const s = num(start);
  const len = num(length);
  const w = Number(width);
  const f = Number(fps);
  const outW = meta ? Math.min(w, meta.width) : w;
  const outH = meta && meta.width ? Math.max(1, Math.round((outW * meta.height) / meta.width)) : 0;
  const frames = Number.isFinite(len) ? Math.max(1, Math.round(len * f)) : 0;
  // Rough rule of thumb for video GIFs: about half a byte per pixel per frame.
  const estimate = outW * outH * frames * 0.5;

  let inputError = "";
  if (!Number.isFinite(s) || s < 0) inputError = "Start time must be 0 or more seconds.";
  else if (!Number.isFinite(len) || len <= 0) inputError = "Duration must be more than 0 seconds.";
  else if (len > MAX_SECONDS) inputError = `Keep the duration at ${MAX_SECONDS} seconds or less.`;
  else if (meta && Number.isFinite(meta.duration) && s >= meta.duration)
    inputError = "Start time is past the end of the video.";

  const convert = async () => {
    if (!url || !meta || inputError) return;
    cancelRef.current = false;
    setBusy(true);
    setProgress(0);
    setError("");
    setResult(null);

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    // Kept in the DOM (invisible) because some mobile browsers will not
    // decode frames for a detached video element.
    Object.assign(video.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "1px",
      height: "1px",
      opacity: "0",
      pointerEvents: "none",
    });
    document.body.appendChild(video);

    try {
      const { GIFEncoder, quantize, applyPalette } =
        // @ts-expect-error gifenc ships no type declarations
        (await import("gifenc")) as Gifenc;

      video.src = url;
      await waitForData(video);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Your browser could not create a drawing canvas.");

      const end = Number.isFinite(meta.duration) ? meta.duration : Infinity;
      const gif = GIFEncoder();
      const step = 1000 / f;
      let written = 0;

      for (let i = 0; i < frames; i++) {
        if (cancelRef.current) throw new Cancelled();
        const t = s + i / f;
        if (t >= end) break;
        await seekTo(video, Math.min(t, end - 0.01));
        ctx.drawImage(video, 0, 0, outW, outH);
        const { data } = ctx.getImageData(0, 0, outW, outH);
        // A fresh 256-color palette per frame keeps colors accurate when
        // the scene changes.
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        // GIF delays are in 1/100 s, so spread the rounding to keep the total
        // length right (15 fps alternates 70 ms and 60 ms frames).
        const delay = Math.round(((i + 1) * step) / 10) * 10 - Math.round((i * step) / 10) * 10;
        gif.writeFrame(index, outW, outH, { palette, delay, repeat: loop ? 0 : -1 });
        written++;
        setProgress((i + 1) / frames);
      }

      if (!written) throw new Error("No frames could be read from that part of the video.");
      gif.finish();
      const bytes = gif.bytes();
      const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
      setResult({ blob, url: URL.createObjectURL(blob), width: outW, height: outH, frames: written });
    } catch (e) {
      if (!(e instanceof Cancelled)) {
        setError(e instanceof Error ? e.message : "Something went wrong while making the GIF.");
      }
    } finally {
      video.removeAttribute("src");
      video.load();
      video.remove();
      setBusy(false);
    }
  };

  const clear = () => {
    setFile(null);
    setUrl("");
    setMeta(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="tool-stack">
      {!file ? (
        <FileDrop
          accept="video/mp4,video/webm,video/quicktime,.mov,.m4v"
          onFiles={pick}
          label="Choose a video or drop it here"
          hint="MP4, WebM or MOV. The file stays on your device."
        />
      ) : (
        <>
          <div className="tool-list-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14.5,
                  color: "var(--ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </div>
              <div className="tool-hint">
                {formatBytes(file.size)}
                {meta && ` · ${meta.width}×${meta.height}`}
                {meta && Number.isFinite(meta.duration) && ` · ${meta.duration.toFixed(1)} s`}
              </div>
            </div>
            <Btn variant="ghost" aria-label="Remove video" disabled={busy} onClick={clear}>
              <X size={16} aria-hidden />
            </Btn>
          </div>

          <video
            ref={previewRef}
            src={url}
            controls
            playsInline
            muted
            preload="metadata"
            style={{ width: "100%", maxHeight: 360, borderRadius: 12, background: "#000" }}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              setMeta({ duration: v.duration, width: v.videoWidth, height: v.videoHeight });
            }}
            onError={() =>
              setError(
                "This browser cannot play this video, so it cannot convert it either. Some MOV files from iPhones use HEVC, which only Safari and some versions of Chrome or Edge can play. Try another browser or an MP4 file.",
              )
            }
          />
        </>
      )}

      {file && (
        <>
          <div className="tool-grid cols-2">
            <Field label="Start time (seconds)" htmlFor="gif-start">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <NumberInput
                  style={{ flex: "1 1 90px" }}
                  id="gif-start"
                  min={0}
                  step={0.1}
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
                <Btn
                  variant="ghost"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => {
                    const v = previewRef.current;
                    if (v) setStart(v.currentTime.toFixed(2));
                  }}
                >
                  Use current position
                </Btn>
              </div>
            </Field>
            <Field label="Duration (seconds)" htmlFor="gif-len" hint={`Up to ${MAX_SECONDS} seconds.`}>
              <NumberInput
                id="gif-len"
                min={0.5}
                max={MAX_SECONDS}
                step={0.5}
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </Field>
          </div>

          <div className="tool-grid cols-2">
            <Field label="Width (pixels)">
              <Segmented
                value={width}
                onChange={setWidth}
                ariaLabel="GIF width"
                options={[
                  { value: "240", label: "240" },
                  { value: "320", label: "320" },
                  { value: "480", label: "480" },
                  { value: "640", label: "640" },
                ]}
              />
            </Field>
            <Field label="Frames per second">
              <Segmented
                value={fps}
                onChange={setFps}
                ariaLabel="Frames per second"
                options={[
                  { value: "8", label: "8" },
                  { value: "10", label: "10" },
                  { value: "15", label: "15" },
                ]}
              />
            </Field>
          </div>

          <label className="tool-checkbox">
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            Loop forever
          </label>

          {inputError && <Notice tone="error">{inputError}</Notice>}

          {meta && meta.width === 0 && (
            <Notice tone="error">This file has no picture track, so there is nothing to turn into a GIF.</Notice>
          )}

          {!inputError && meta && outH > 0 && (
            <div className="tool-hint">
              Output: {outW}×{outH}, {frames} frames, roughly {formatBytes(estimate)} (real size
              depends on how busy the video is).
            </div>
          )}

          {!inputError && estimate > 10 * 1024 * 1024 && (
            <Notice>
              This GIF could be large (over 10 MB). Many chat apps and sites reject big GIFs. Try a
              smaller width, fewer frames per second, or a shorter clip.
            </Notice>
          )}

          <div className="tool-actions">
            <Btn onClick={convert} disabled={busy || !meta || !!inputError}>
              {busy ? "Making GIF..." : "Convert to GIF"}
            </Btn>
            {busy && (
              <Btn variant="ghost" onClick={() => (cancelRef.current = true)}>
                Cancel
              </Btn>
            )}
          </div>

          {busy && <Progress value={progress} label="Reading frames" />}
        </>
      )}

      {error && <Notice tone="error">{error}</Notice>}

      {result && (
        <div className="tool-stack">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
          <img
            src={result.url}
            alt="Your GIF"
            style={{ display: "block", maxWidth: "100%", height: "auto", borderRadius: 12, margin: "0 auto" }}
          />
          <div className="tool-grid cols-3">
            <Stat label="GIF size" value={formatBytes(result.blob.size)} accent />
            <Stat label="Dimensions" value={`${result.width}×${result.height}`} />
            <Stat label="Frames" value={result.frames} />
          </div>
          {result.blob.size > 10 * 1024 * 1024 && (
            <Notice>
              Over 10 MB. If it will not upload somewhere, convert again with a smaller width or
              8 fps.
            </Notice>
          )}
          <div className="tool-actions">
            <Btn onClick={() => file && downloadBlob(result.blob, renameFile(file.name, "", "gif"))}>
              <Download size={16} aria-hidden /> Download GIF
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
