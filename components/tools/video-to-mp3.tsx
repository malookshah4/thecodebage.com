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

const SAMPLE_RATE = 44100;
const BLOCK = 1152; // samples per MP3 frame
const BIG_FILE = 1024 * 1024 * 1024;

interface Mp3Result {
  blob: Blob;
  url: string;
  name: string;
  seconds: number;
  kbps: string;
  mono: boolean;
}

class Cancelled extends Error {}

function num(s: string): number {
  return s.trim() === "" ? NaN : Number(s);
}

function clock(sec: number): string {
  if (!Number.isFinite(sec)) return "-";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

function toInt16(x: number): number {
  const s = x < -1 ? -1 : x > 1 ? 1 : x;
  return s < 0 ? s * 0x8000 : s * 0x7fff;
}

const nextTick = () => new Promise<void>((r) => setTimeout(r, 0));

export default function VideoToMp3() {
  const [file, setFile] = useState<File | null>(null);
  const [audio, setAudio] = useState<AudioBuffer | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("");
  const [kbps, setKbps] = useState("192");
  const [channels, setChannels] = useState<"stereo" | "mono">("stereo");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Mp3Result | null>(null);
  const [error, setError] = useState("");
  const cancelRef = useRef(false);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  const pick = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setAudio(null);
    setResult(null);
    setError("");
    setDecoding(true);
    try {
      const buf = await f.arrayBuffer();
      // An offline context needs no speakers or user gesture, and it
      // resamples everything to 44.1 kHz, which every MP3 player handles.
      const ctx = new OfflineAudioContext(1, 1, SAMPLE_RATE);
      const decoded = await ctx.decodeAudioData(buf);
      setAudio(decoded);
      setStart("0");
      setEnd(decoded.duration.toFixed(2));
    } catch {
      setError(
        "Could not read the sound from this file. Either it has no audio track, or your browser cannot decode its audio format (some MOV and MKV files only work in certain browsers). Try Chrome or Edge, or another file.",
      );
    } finally {
      setDecoding(false);
    }
  };

  const duration = audio?.duration ?? 0;
  const s = num(start);
  const e = num(end);
  let inputError = "";
  if (audio) {
    if (!Number.isFinite(s) || s < 0) inputError = "Start must be 0 or more seconds.";
    else if (!Number.isFinite(e) || e <= s) inputError = "End must be after the start.";
    else if (s >= duration) inputError = "Start is past the end of the audio.";
  }
  const clipEnd = Number.isFinite(e) ? Math.min(e, duration) : duration;
  const clipSeconds = Math.max(0, clipEnd - (Number.isFinite(s) ? s : 0));
  const sourceMono = audio ? audio.numberOfChannels === 1 : false;
  const outChannels = channels === "mono" || sourceMono ? 1 : 2;
  const estimate = (clipSeconds * Number(kbps) * 1000) / 8;

  const encode = async () => {
    if (!audio || !file || inputError) return;
    cancelRef.current = false;
    setBusy(true);
    setProgress(0);
    setError("");
    setResult(null);
    try {
      const { Mp3Encoder } = await import("@breezystack/lamejs");
      const rate = audio.sampleRate;
      const encoder = new Mp3Encoder(outChannels, rate, Number(kbps));
      const L = audio.getChannelData(0);
      const R = audio.numberOfChannels > 1 ? audio.getChannelData(1) : L;
      const from = Math.floor(s * rate);
      const to = Math.min(audio.length, Math.floor(clipEnd * rate));
      const left = new Int16Array(BLOCK);
      const right = new Int16Array(BLOCK);
      const parts: Uint8Array<ArrayBuffer>[] = [];
      let n = 0;

      for (let pos = from; pos < to; pos += BLOCK) {
        const len = Math.min(BLOCK, to - pos);
        for (let i = 0; i < len; i++) {
          const a = L[pos + i];
          const b = R[pos + i];
          if (outChannels === 1) {
            left[i] = toInt16((a + b) / 2);
          } else {
            left[i] = toInt16(a);
            right[i] = toInt16(b);
          }
        }
        const l = len === BLOCK ? left : left.subarray(0, len);
        const r = len === BLOCK ? right : right.subarray(0, len);
        const out = outChannels === 1 ? encoder.encodeBuffer(l) : encoder.encodeBuffer(l, r);
        if (out.length) parts.push(new Uint8Array(out));

        // Give the browser a moment every ~3 seconds of audio so the page
        // stays responsive and Cancel works.
        if (++n % 120 === 0) {
          setProgress((pos - from) / (to - from));
          await nextTick();
          if (cancelRef.current) throw new Cancelled();
        }
      }
      const tail = encoder.flush();
      if (tail.length) parts.push(new Uint8Array(tail));

      const blob = new Blob(parts, { type: "audio/mpeg" });
      setProgress(1);
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        name: renameFile(file.name, "", "mp3"),
        seconds: (to - from) / rate,
        kbps,
        mono: outChannels === 1,
      });
    } catch (err) {
      if (!(err instanceof Cancelled)) {
        setError(err instanceof Error ? err.message : "Something went wrong while encoding.");
      }
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setFile(null);
    setAudio(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="tool-stack">
      {!file ? (
        <FileDrop
          accept="video/*,audio/*,.mov,.mkv,.m4a"
          onFiles={pick}
          label="Choose a video or audio file, or drop it here"
          hint="MP4, MOV, WebM, M4A, WAV and more. The file stays on your device."
        />
      ) : (
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
              {decoding && " · reading audio..."}
              {audio &&
                ` · ${clock(audio.duration)} · ${audio.numberOfChannels === 1 ? "mono" : "stereo"}`}
            </div>
          </div>
          <Btn variant="ghost" aria-label="Remove file" disabled={busy || decoding} onClick={clear}>
            <X size={16} aria-hidden />
          </Btn>
        </div>
      )}

      {file && file.size > BIG_FILE && (
        <Notice>
          This is a very large file. The whole audio track has to fit in memory, so the browser
          tab may slow down or crash, especially on phones. If that happens, try a shorter video.
        </Notice>
      )}

      {decoding && <Notice>Reading the audio track. Long videos can take a little while.</Notice>}

      {audio && (
        <>
          <div className="tool-grid cols-2">
            <Field label="Start (seconds)" htmlFor="mp3-start">
              <NumberInput
                id="mp3-start"
                min={0}
                step={0.1}
                value={start}
                onChange={(ev) => setStart(ev.target.value)}
              />
            </Field>
            <Field
              label="End (seconds)"
              htmlFor="mp3-end"
              hint={`Full length: ${clock(duration)} (${duration.toFixed(1)} s)`}
            >
              <NumberInput
                id="mp3-end"
                min={0}
                step={0.1}
                value={end}
                onChange={(ev) => setEnd(ev.target.value)}
              />
            </Field>
          </div>

          <div className="tool-grid cols-2">
            <Field label="Bitrate" hint="192 kbps sounds great for most music. 128 is fine for speech.">
              <Segmented
                value={kbps}
                onChange={setKbps}
                ariaLabel="Bitrate"
                options={[
                  { value: "128", label: "128 kbps" },
                  { value: "192", label: "192 kbps" },
                  { value: "320", label: "320 kbps" },
                ]}
              />
            </Field>
            <Field label="Channels" hint={sourceMono ? "The source is mono, so the MP3 will be mono." : undefined}>
              <Segmented
                value={channels}
                onChange={setChannels}
                ariaLabel="Channels"
                options={[
                  { value: "stereo", label: "Stereo" },
                  { value: "mono", label: "Mono" },
                ]}
              />
            </Field>
          </div>

          {inputError ? (
            <Notice tone="error">{inputError}</Notice>
          ) : (
            <div className="tool-hint">
              Clip length {clock(clipSeconds)}, MP3 will be about {formatBytes(estimate)}.
            </div>
          )}

          <div className="tool-actions">
            <Btn onClick={encode} disabled={busy || !!inputError}>
              {busy ? "Converting..." : "Convert to MP3"}
            </Btn>
            {busy && (
              <Btn variant="ghost" onClick={() => (cancelRef.current = true)}>
                Cancel
              </Btn>
            )}
          </div>

          {busy && <Progress value={progress} label="Encoding MP3" />}
        </>
      )}

      {error && <Notice tone="error">{error}</Notice>}

      {result && (
        <div className="tool-stack">
          <audio src={result.url} controls style={{ width: "100%" }} />
          <div className="tool-grid cols-3">
            <Stat label="MP3 size" value={formatBytes(result.blob.size)} accent />
            <Stat label="Length" value={clock(result.seconds)} />
            <Stat label="Quality" value={`${result.kbps} kbps`} sub={result.mono ? "Mono" : "Stereo"} />
          </div>
          <div className="tool-actions">
            <Btn onClick={() => downloadBlob(result.blob, result.name)}>
              <Download size={16} aria-hidden /> Download MP3
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
