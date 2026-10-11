---
title: "How to spot AI-generated images in 2026 (and where checks fail)"
description: "Practical visual and context checks for spotting AI images, why the old tells like bad hands are fading, and why detectors give odds, not verdicts."
date: "2026-10-11"
category: "Guides"
appName: "Real or AI"
appHref: "/apps/android/real-or-ai/"
---

A couple of years ago you could spot most AI images by counting fingers. Six fingers, melted knuckles, a hand growing out of a sleeve at a strange angle. Done. That trick is mostly dead now. The big image generators fixed hands, and they got much better at text too.

So this is a more honest guide. I'll go through the visual checks that still catch a lot of fakes, then the context checks that matter more than any pixel, and then why every detector (including the one I built) gives you a probability and not a final answer.

## The old tells are fading, so don't rely on them

People still share those "how to spot AI" posts that say look at the hands, look at the teeth, look for garbled text. Those were good advice in 2023. Today a decent generator will give you five clean fingers and a readable shop sign most of the time.

The danger is false confidence. If you check the hands, see they look fine, and decide the image is real, you've learned nothing. A clean hand doesn't prove anything anymore. A broken hand is still a strong hint, but its absence is not evidence of a real photo.

What still works is slower. You look at the parts of the image the generator didn't "care" about, and you look at where the image came from.

## Look at the background, not the subject

Generators put most of their effort into the main subject. The face, the person, the dog, the product. The edges and the background get less attention, and that's where things fall apart.

Things I check first:

- **Repeated patterns.** Crowds where several faces look like cousins. Bricks, tiles or windows that repeat almost perfectly, then suddenly change shape.
- **Objects that melt into each other.** A chair leg that becomes part of the floor. A fence that turns into a tree branch halfway along.
- **Furniture and buildings that don't make sense.** Stairs that lead nowhere, a door with no handle at a strange height, a car with three wheels visible on one side.
- **Text in the background.** The main headline might be fine, but look at the small print. Labels on bottles, street signs far away, writing on a t-shirt in the crowd. This is where you still see letters that look like a language but aren't one.

Zoom in. Really zoom in, on a big screen if you can. On a phone at normal size most fakes look perfect. At 300% the background often tells a different story.

## Lighting, shadows and reflections

This is my favorite check because it requires actual physics, and generators still don't do physics. They do "looks about right".

Find the main light source. Is it the sun on the left? A window behind the person? Now check the shadows. Every shadow from that one light should fall in roughly the same direction. In AI images you often get a person whose shadow goes left while the lamp post next to them casts one to the right. Or no shadow at all under a car parked in bright sun.

Reflections are similar. Look at mirrors, shop windows, sunglasses, water, the shiny side of a car. Does the reflection actually match what's in front of it? Often the reflection shows a slightly different scene, or a person in the mirror wearing different clothes, or no reflection where there obviously should be one.

Eyes are a small version of this. In a real photo, both eyes usually show the same catchlight (the little white dot from the light source) in about the same place. Mismatched catchlights are a decent hint, though not proof, because real photos with two light sources can do this too.

## Faces, skin and small accessories

Portraits have their own set of tells. Some still hold up well:

Skin that is too smooth. Real skin has pores, small marks, uneven color, fine hair. Many AI portraits have that waxy, airbrushed look where the cheek looks like plastic. The problem is that beauty filters do the same thing to real photos, so this alone tells you little.

Asymmetry in paired things. Earrings that don't match (one hoop, one stud, when clearly they're meant to be a pair). Glasses where the left frame is a different shape from the right, or the arm of the glasses disappears into the hair and never reaches the ear. Ears at different heights, or with very different shapes. Generators build each side somewhat separately, and it shows.

Hair edges. Look where hair meets the background. Strands that dissolve into blur, or hair that merges with a scarf or collar, are common in generated images.

Teeth are less reliable now, but a smile with too many front teeth, or teeth that blur into one white strip, is still a flag.

## Context checks matter more than pixels

Honestly, this is where most fakes get caught. Not by staring at pixels, but by asking where the image came from.

**Reverse image search.** Use Google Lens or TinEye. On a phone you can long-press an image in Chrome and choose "Search image with Google". You're looking for older copies. If a "breaking news" photo shows up on a stock site from three years ago, or on an AI art account, you have your answer. If it shows up nowhere at all except the one viral post, that tells you something too.

**Who posted it first.** Scroll back to the earliest copy you can find. Was it a news photographer with a name and a history? Or an account created last month that posts dramatic images every few hours? Real photos of real events usually have several photographers and angles. A single perfect shot of a dramatic moment, with no other images from anyone else who was there, should make you suspicious.

**Metadata.** Real camera photos often carry EXIF data: camera model, lens, date. Most social apps strip this when you upload, so missing metadata doesn't mean much. But if you have the original file and it says it was made by an AI tool, that's useful.

**Content Credentials (C2PA).** This is a newer standard where cameras, editing apps and some AI generators attach a signed record of how the image was made. Some platforms now show a small "CR" label or an "AI info" tag. You can also upload a file to the Content Credentials verify site to read it. It's helpful when it's there. It's often not there, and it can be stripped by a screenshot, so a missing label proves nothing either way.

If you're dealing with a video rather than a still image, I wrote a separate routine in [how to fact-check a viral video](/blog/how-to-fact-check-a-viral-video/).

## Why detectors give odds, not verdicts

AI image detectors work by looking for statistical patterns that generators leave behind. Texture, noise, the way edges and colors are distributed. They're trained on lots of real and fake images and they learn to tell the two apart, most of the time.

The weak spots are predictable:

1. Heavily edited real photos. Strong beauty filters, aggressive sharpening, background replacement, HDR. These can push a real photo toward "looks AI" and cause a false positive.
2. Screenshots and re-uploads. Every time an image gets compressed by WhatsApp or Instagram, some of the signal the detector relies on gets wiped out.
3. New generators. A detector trained before a new model came out may not recognize its style yet.
4. Mixed images. A real photo with one AI-edited part (a removed person, an added sky) is hard for any tool to judge as a whole.

So when a detector says "87% likely AI", read that as "this looks a lot like the AI images I was trained on". Not "this is fake". A good detector is one input, next to the visual checks and the context checks above.

## Where Real or AI fits

I built [Real or AI](/apps/android/real-or-ai/) because I kept doing these checks by hand and wanted a quick first opinion. You can drop in an image, video, audio clip or text, or paste a link to a social post, and it gives you a confidence score for how likely it is to be AI-generated. It keeps a history of what you checked, which helps when you're trying to remember where you saw something.

But I'll be straight about it: it's an estimate, not proof. Everything in the section above applies to my app too. A heavily filtered selfie can score high. A compressed screenshot of a fake can score low. I use it the same way I'd tell you to use it, as one signal, and then I do the reverse search anyway.

If you only remember one thing: when an image makes you feel something strong, like anger or shock, that's exactly when to slow down and check where it came from before you share it.
