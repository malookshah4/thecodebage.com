---
title: "Frame-by-frame animation on your phone: a beginner's guide"
description: "Learn frame-by-frame animation on a phone, starting with a bouncing ball. Covers frame rate, onion skinning, keyframes, easing and exercises with frame counts."
date: "2026-10-11"
category: "Creators"
appName: "ArtAnimator - Animation Maker"
appHref: "/apps/android/artanimator-animation-maker/"
---

Frame-by-frame animation is the old way: you draw one picture, then the next one slightly different, then the next, and when you play them fast the drawing moves. It's slow. It's also one of the most satisfying things you can do with a phone and a finger, because the first time a ball you drew actually bounces, it feels a bit like magic.

You don't need a tablet or expensive software to learn the basics. A phone is enough for small loops, and small loops are exactly where beginners should start anyway. This guide walks through the ideas that matter most and gives you a few exercises with real frame counts.

## Start with a bouncing ball

Every animation course starts with a bouncing ball, and people sometimes skip it because it seems too simple. Don't skip it. A ball has no arms, no face, no clothes to redraw. All your attention goes to timing and movement, which is the hard part of animation anyway.

Once the ball feels right, move on to something like a blink or a simple walk. A blink is great because it's only a few frames and it instantly makes a face feel alive. A walk is harder, but it teaches you how a loop has to connect back to its start.

## Frame rate: 12 vs 24 fps

Frame rate is how many drawings play per second. Films usually run at 24 frames per second. That sounds like you need to draw 24 pictures for every second of animation, but most hand-drawn animation doesn't actually do that.

A lot of traditional animation is done "on twos", which means each drawing is held for two frames. At 24 fps that works out to 12 new drawings per second. It looks a bit less smooth than full 24, but it still reads as motion and it halves your work. Many people can't even tell the difference in a short loop.

| Setting | New drawings per second | Feel | Work |
|:-|:-|:-|:-|
| 8 fps | 8 | Choppy, stylized | Light |
| 12 fps (on twos) | 12 | Smooth enough, classic look | Medium |
| 24 fps (on ones) | 24 | Very smooth | Heavy |

For learning, I'd set the app to 12 fps and leave it there. You can always try fast actions at 24 later, when you know which movements actually need it.

## Onion skinning

Onion skinning shows you the previous frame (and sometimes the next one) as a faint, see-through layer under the frame you're drawing. The name comes from the thin onion-skin paper animators used to use on a light table.

Without it, you're guessing where the ball was a moment ago. With it, you can see exactly how far it moved, and you can keep the spacing even or change it on purpose. Turn it on from the start. Most beginners who say "my animation looks jittery" are drawing without onion skin, and their shapes drift a little in size and position from frame to frame.

One small tip: if the onion skin gets confusing with too many ghost frames showing, reduce it to just the one previous frame.

## Keyframes first, in-betweens after

Don't draw frame 1, then frame 2, then frame 3 in order from start to end. That's called straight-ahead animation, and while it has its uses, it's easy to lose control of where things end up.

The more reliable method:

1. Draw the **keyframes** first. These are the main poses: for a ball bounce, the top of the arc and the moment it hits the ground.
2. Play just those to check the timing feels roughly right.
3. Draw the **in-betweens**, the frames that fill the gaps between keys.

This way the important poses are locked in early, and you can't accidentally end up with the ball landing in the wrong spot after 20 frames of drawing.

## Squash and stretch

A rubber ball doesn't stay perfectly round. When it hits the ground, it flattens a little (squash). When it's falling fast, it gets a bit longer in the direction it's moving (stretch). At the top of the bounce, where it slows down, it's round again.

The trick is to keep the volume about the same. If the ball gets wider when it squashes, it should also get shorter. If you just make it bigger, it looks like it's inflating. Don't overdo it either. A bowling ball barely squashes at all. A water balloon squashes a lot. How much you squash tells the viewer what the object is made of, which is kind of neat when you think about it.

## Ease in and ease out

Things in real life speed up and slow down. A ball thrown up slows near the top, hangs for a moment, then speeds up as it falls. If every frame moves the same distance, the motion looks robotic.

In animation this is done with spacing. Near the ends of a movement (the start and stop), you place the drawings close together. In the middle, where the object moves fastest, you space them further apart. Animators call this ease in and ease out, or slow in and slow out.

With onion skin on, you can literally see this. At the top of the bounce your ghost frames should be bunched up. Near the ground they should be spread out. This one idea will improve your animation more than any brush or effect.

## Keep the background on its own layer

If your animation has a background (a floor line, a room, a sky), put it on a separate layer. Then you only draw it once, and each frame only needs the moving part redrawn.

Without layers, you either redraw the background every frame (painful, and it will wobble) or you copy it each time and risk changing it by accident. Layers also let you lower the opacity of a sketch layer, draw a clean line on top, and hide the sketch when you're done.

## Small canvas, short loops, and the stylus question

Your first animations should be tiny. A few seconds, often less. A loop that's 8 or 12 frames long is plenty. Short loops let you finish something in one evening, and finishing things is how you get better. A three-minute short film is how you end up with 40 frames and a half-abandoned project.

About styluses: you don't strictly need one. A finger works for simple shapes, especially a ball or bold cartoon lines. A cheap capacitive stylus helps you see what you're drawing (your fingertip covers the line), but it won't give pressure sensitivity on most phones. If you have a phone or tablet with a real active pen, great, use it. If not, keep your style simple and bold, which looks better at phone size anyway.

## Exercises with frame counts

These are at 12 fps. Do them in order.

- **Ball bounce in place (12 frames, 1 second loop).** Ball drops, squashes on the ground, rises back to the top. Keys: top (frame 1), ground contact (frame 7). Space frames close at the top, far apart near the ground.
- **Ball bouncing across the screen (24 frames).** Same as above, but moving left to right with each bounce a bit lower. This teaches you arcs and losing energy.
- **Blink (6 to 8 frames).** Eyes open, half closed, closed (hold 1 to 2 frames), half open, open. Hold the open pose for a while before and after so the loop doesn't feel twitchy.
- **Pendulum swing (16 frames).** Ease in and out at each end of the swing, fastest at the bottom.
- **Simple walk cycle (8 to 12 frames).** Start with a stick figure. Keys are the two contact poses where each foot hits the ground. Don't worry about arms at first.

After each one, play it back several times and look for anything that "pops". A pop usually means two neighbouring frames are too far apart or a shape changed size by accident.

## Exporting your loop

When you're happy, export as a GIF or a short video. GIFs are nice for sharing loops in chats and they play automatically, but they're limited in colors and can get large. A video file (MP4) is better quality and smaller, and it's what you need for short-video platforms. For a loop on social media, it often helps to repeat the cycle several times in the export so it plays for a few seconds.

## What I use

I built [ArtAnimator](/apps/android/artanimator-animation-maker/) for exactly this kind of small, finger-drawn animation. It has onion skin for previous and next frames, a frame timeline where you can add, duplicate and reorder frames, adjustable FPS, multiple layers per frame with opacity, and a ghost trail effect. It's a simple 2D drawing tool, not a full studio, so if you want bones, rigging or lip sync, you'll want desktop software later.

If you post your animations as short videos, my notes on [why captions matter on short videos](/blog/why-captions-matter-on-short-videos/) might help too, especially if you add narration or a title.

Start with the ball. Twelve frames. It'll look wrong the first time, and the second time it'll look a little less wrong, and that's how it goes.
