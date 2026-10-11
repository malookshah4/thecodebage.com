---
title: "Why I build local-first apps (and where I don't)"
description: "What local-first software means, the honest tradeoffs, why data you never collect can't leak, and how to judge any app's privacy claims yourself."
date: "2026-10-11"
category: "Behind the build"
appName: "LifeOS"
appHref: "https://lifeos.thecodebage.com/"
---

Most apps I build keep your data on your device. No account, no sync server, no analytics SDK quietly reporting what you tapped. People sometimes assume this is a marketing angle. It's mostly a decision about what kind of risk I'm willing to carry as a one-person studio.

It's also not free. Local-first has real downsides, for you and for me, and not every app I make can work this way. This post is my attempt to be straight about both sides, and to give you a way to check any app's privacy claims, mine included, without having to trust the developer.

## What local-first actually means

The term got popular after a 2019 essay called "Local-first software" by the research lab Ink & Switch. Their version is quite ambitious, with collaboration and sync built on top. Mine is simpler.

For me, local-first means the app does its main job on your device, and your data lives on your device. If my servers disappeared tomorrow, the app would keep working. If you turn on airplane mode, the core features still work. The network is something the app might use for specific things, not something it depends on to exist.

That's different from "we encrypt your data in the cloud". Encryption in the cloud can be good. But your data is still sitting on someone's server, and you're trusting that company's security, their staff, their future owners, and their privacy policy, which they can change.

## Why it matters to me

The simplest reason: data I never collect can't leak.

Every company that stores user data is one bad configuration away from a breach. Big companies with security teams get breached regularly. I'm one person. I'm careful, but I'm not a security team, and I'd be lying if I said I couldn't make a mistake. The safest database is the one that doesn't exist.

There's a second reason that's more selfish. If I don't hold your data, I don't have to protect it, back it up, answer legal requests about it, or worry about it while I sleep. Running fewer servers means fewer things break at 3 a.m. For a small studio that matters a lot.

And there's speed. Things that run on the device don't wait for a round trip to a server. A phone trackpad is a good example. Sending a cursor movement to the cloud and back would be slow and pointless when the phone and PC sit in the same room. I wrote about that decision in [what I learned building Phone Mouse](/blog/what-i-learned-building-phone-mouse/).

## The tradeoffs, honestly

Here's what you give up, and what I give up.

**No free sync between devices.** If your data lives on your phone, it doesn't automatically appear on your laptop. Sync needs something in the middle, usually a server, and servers cost money and bring back the privacy questions. Some local-first apps let you sync through your own cloud folder. That can work, but be careful: copying a database file while the app has it open can corrupt it. Close the app first.

**You handle your own backups.** If your phone falls in a river and the data was only on that phone, it's gone. I can't restore it because I never had it. That's the point, and also the problem. Local-first apps should make export and backup easy, and you should actually use those features.

**Debugging is harder for me.** Without telemetry I don't see crashes as they happen, or which screen confuses people, or which feature nobody uses. I rely on people writing to me and on testing a lot of devices myself. Honestly, this part is frustrating sometimes. A bug can sit in an app for a while before someone mentions it. I still think it's the right trade.

**Some features need the internet.** This is the one I want to be clearest about. Not every codeBage app is local-first, because some jobs can't be done on a phone. TrueCheck checks claims in social media posts by searching the web and citing sources, which obviously needs an online service. Captio generates subtitles on the phone with Whisper in the free tier, but its AI translation into other languages uses an online service. When an app needs to send something off the device, I'd rather say so plainly than hide it behind vague wording.

So "local-first" is a default, not a religion. When the job can be done on the device, it should be. When it can't, the app should say what leaves the device and why.

## LifeOS, the extreme version

[LifeOS](https://lifeos.thecodebage.com/) is where I pushed the idea as far as it goes. It's a Windows app that works as a second brain: it indexes what's on your screen, your voice, and your system audio, so you can later search or ask questions about things you saw or heard.

Written down like that, it sounds like spyware. That's exactly why it had to be fully local. If an app records your screen, the only acceptable place for that data is your own disk.

So everything runs on your PC. Text on screen is read with on-device OCR. Speech is transcribed with Whisper running locally. Questions are answered by a local language model searching your own history. There's an **air-gap mode** toggle that blocks all outbound traffic, so you don't have to take my word that nothing is sent. Your data sits in a plain SQLite file that you can open with any SQLite viewer, delete, or wipe. There's no account and no telemetry.

It's also free and open source on GitHub, so anyone can read what it does. That's the strongest promise I can make, because it's not a promise. You can check.

The cost here is size and hardware. It's around 180 MB, it needs Windows 10 (version 1903 or newer) or Windows 11, 64-bit, and running speech recognition and a language model locally uses real CPU and memory. A cloud service would run on someone else's computer. LifeOS runs on yours. For something that sees your whole screen, I think that's the only honest design.

## How to judge any app's privacy claims

You shouldn't trust a developer just because they say "privacy first" on their website. Anyone can write that. Here's what I'd actually check:

1. **Permissions.** On Android, go to **Settings > Apps**, pick the app, and open **Permissions**. Does a flashlight app want your contacts? Does a calculator want your location? Permissions that don't match the job are the biggest red flag.
2. **Does it work offline?** Turn on airplane mode and use the app. If a simple offline task suddenly fails, it was talking to a server for that task. Not always bad, but now you know.
3. **Network activity.** On Windows, open **Resource Monitor** (search for it in Start) and look at the **Network** tab. It shows which programs are sending data and to where. If an app that claims to be offline keeps connecting to addresses you don't recognize, ask why.
4. **The privacy policy.** Boring, but read it. Search it for "third parties", "partners", "analytics" and "advertising". A short, specific policy is usually a better sign than a long, vague one.
5. **The Play Store "Data safety" section.** Useful, but remember developers fill it in themselves. It's a claim, not an audit.
6. **Open source.** If the code is public, you or someone you trust can check what it does. It's not perfect proof, since the app you download could in theory differ from the published code. But it's far more than most apps give you.
7. **Account requirements.** If an app that could work alone forces you to sign up, the account is probably there for the company's benefit, not yours.

None of these is perfect alone. Together they give you a pretty good picture.

## Where I land

I don't think the cloud is evil, and I use plenty of cloud services myself. Sync is convenient. Online AI can do things a phone can't. But I think the default got flipped somewhere along the way. Apps now send data off the device because it's easy, not because the job needs it.

My rule is simple: keep it on the device unless there's a clear reason not to, and when there is, say so. If you only take one habit from this post, make it the airplane mode test. It takes ten seconds and tells you more than most privacy policies.
