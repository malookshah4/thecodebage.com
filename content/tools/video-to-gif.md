This tool cuts a short moment out of a video and turns it into an animated GIF. Pick a clip from your phone or computer, choose where it starts and how long it runs, and you get a looping GIF you can drop into a chat, a forum post, a README or a slide.

Everything happens inside your browser. The video is never uploaded anywhere, which also means there is no waiting in a queue and no watermark.

## How to use

1. Click **Choose a video or drop it here** and pick an MP4, WebM or MOV file.
2. Play the preview and pause on the moment you want. Press **Use current position** to copy that time into **Start time (seconds)**, or type it yourself.
3. Set **Duration (seconds)**. The default is 4 seconds and the maximum is 15.
4. Pick a **Width** (240, 320, 480 or 640 pixels) and **Frames per second** (8, 10 or 15).
5. Leave **Loop forever** on if you want it to repeat, which is what most people expect from a GIF.
6. Press **Convert to GIF**, wait for the progress bar, then check the preview and press **Download GIF**.

## Why GIFs get so big

GIF is an old format from the late 1980s. It can only store 256 colors per frame and it compresses each frame on its own, without the clever motion tricks that make MP4 files small. So a 4 second GIF is often bigger than the 30 second video it came from. That surprises people, but it is normal.

Size grows with three things, roughly multiplied together: width times height, frames per second, and duration. Going from 480 to 640 pixels wide almost doubles the pixel count. Going from 10 to 15 fps adds half again. A 15 second clip at 640 wide and 15 fps can easily pass 30 MB, which most chat apps will refuse.

The tool shows an estimate before you convert and warns you above 10 MB. Treat it as a ballpark. A static talking head compresses well, while confetti, water, grass or fast camera moves come out much larger.

## Picking good settings

For a reaction GIF to send on WhatsApp, Telegram or Discord, 320 or 480 pixels wide at 10 fps is plenty. People view these on phones, so 640 is wasted on them.

For a screen recording, like showing a bug or a short UI demo, use 640 wide so text stays readable, and drop to 8 fps. Screen content has big flat areas, so it compresses better than camera footage, and smooth motion matters less than sharp text.

If the GIF looks choppy, raise the frame rate before you raise the width. If it is too big, lower the width first, then the frame rate, then trim the duration. Cutting a second or two from a slow start usually helps more than you would think.

Each frame gets its own 256 color palette, picked from that frame's actual colors. That keeps skin tones and scene changes looking right, though smooth gradients like a sunset sky may still show some banding. That is a GIF limit, not a bug.

## FAQ

### Is this free, and is my video uploaded?

It is free with no sign-up. The conversion runs on your device in the browser, and the video file is never sent to any server.

### Why won't my iPhone MOV file open?

Many iPhone videos use the HEVC (H.265) codec. If your browser cannot play the file in the preview, it cannot convert it either. Try Safari, or a recent Chrome or Edge, or export the video from your phone as "Most Compatible" (H.264) first.

### Why is there a 15 second limit?

Longer GIFs become huge files that are slow to make, slow to load and often rejected by the apps you want to post them on. For anything longer, a short MP4 is the better format.

### Does the GIF have sound?

No. GIF has no audio support at all. If you need the sound, keep it as a video, or use the Video to MP3 tool to save the audio separately.
