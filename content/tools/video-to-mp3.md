This tool pulls the sound out of a video and saves it as an MP3. It is handy for a lecture you want to hear on a walk, a voice note someone sent as a video, or a song from your own recording. You can trim it too.

The file is read and converted in your browser. Nothing is uploaded, so a 500 MB video does not have to crawl over a slow connection first.

## How to use

1. Click **Choose a video or audio file, or drop it here** and pick your file. MP4, MOV, WebM, M4A and WAV all work in most browsers.
2. Wait a moment while the tool reads the audio. You will see the full length and whether it is mono or stereo.
3. If you only want part of it, change **Start (seconds)** and **End (seconds)**. By default the whole track is kept.
4. Choose a **Bitrate** (128, 192 or 320 kbps) and **Stereo** or **Mono** under **Channels**.
5. Press **Convert to MP3**. A progress bar shows how far along it is, and **Cancel** stops it.
6. Listen to the preview, then press **Download MP3**. The file keeps the original name with a .mp3 ending.

## Which bitrate to pick

Bitrate is how many kilobits of data each second of sound gets. More bits means fewer compression artifacts, and a bigger file. A rough guide:

| Bitrate | Good for | Size per minute (about) |
| - | - | - |
| 128 kbps | Speech, lectures, podcasts, voice notes | just under 1 MB |
| 192 kbps | Most music, general use | 1.4 MB |
| 320 kbps | Music you care about, archiving | 2.3 MB |

One thing people often miss: the MP3 can never sound better than the audio inside the video. Phone videos and most online videos already carry compressed audio, often around 128 kbps AAC. Converting that to 320 kbps MP3 makes a bigger file, not a better one. I usually pick 192 for music and 128 for anything that is mostly talking.

## Mono or stereo

Stereo keeps the left and right channels separate. Use it for music and anything recorded with a proper stereo mic.

Mono mixes both channels into one. For a lecture, a sermon, a meeting recording or a voice note, mono is the smarter choice. It sounds the same through one earbud or a phone speaker, and at the same bitrate each channel effectively gets more data. If the source is already mono, the tool keeps it mono no matter what you choose.

## When a file will not open

The tool uses your browser's own audio decoder. That keeps it fast and private, but it also means support depends on the browser. Chrome and Edge handle the most formats. Some MOV files from cameras, and some MKV files, use audio codecs that Firefox or Safari will not decode. If you get an error, try another browser before giving up.

Very large files are the other limit. The whole audio track is unpacked into memory as raw samples, and an hour of stereo sound takes more than 1 GB that way. A laptop with 8 GB of RAM usually copes. On a phone with limited memory, the tab may reload. Trimming does not help with this step, because the full track is read first, so for huge files a desktop browser is the safer bet.

## FAQ

### Is it free, and are my files uploaded?

Yes, it is free, and no, nothing is uploaded. The audio is decoded and encoded inside your browser, on your own device.

### Can I convert a YouTube link?

No. This tool works with files on your device only. It does not download from websites, and you should only convert videos you have the right to use.

### Why is the MP3 sample rate always 44.1 kHz?

Audio is resampled to 44.1 kHz during decoding. Every MP3 player and car stereo supports that rate, so the file plays everywhere, and for listening there is no audible loss.

### How long does it take?

A few seconds for a song and under a minute for a long lecture on a modern laptop. Phones are slower.
