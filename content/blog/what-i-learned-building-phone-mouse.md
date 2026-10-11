---
title: "What I learned building Phone Mouse, a phone-to-PC remote"
description: "Design notes from building a phone trackpad app for Windows: why it is LAN-only, why setup is one screen, and why the firewall prompt matters most."
date: "2026-10-11"
category: "Behind the build"
appName: "Phone Mouse"
appHref: "/apps/remote-mouse-pro/"
---

Phone Mouse looks like a small app. You touch the phone, the cursor on your PC moves. When I started I thought the hard part would be making the cursor feel smooth.

It wasn't. The cursor was the fun part. The hard parts were everything around it: getting two devices to find each other on networks I don't control, the way Windows handles screens with different scaling, and one popup that I didn't design and can't remove. These are some notes on the decisions I made, and a few I'd make differently.

## No account, no cloud, on purpose

The first decision was the easiest. Phone Mouse works only on your local network. The phone talks to the PC directly. There's no server of mine in between, and you don't sign up for anything. You pair with a PIN shown on the PC.

I had a few reasons. A keyboard app sees everything you type, including passwords. I don't want that passing through a server I run, even with good intentions, because a server I run is a server that can be hacked, subpoenaed, or misconfigured by me at 2 a.m. Data I never receive is data I can't lose.

There's also a plain engineering reason. Sending a mouse movement to a cloud server and back adds delay, and delay is the one thing a trackpad can't hide. The phone and PC are usually in the same room. Routing their conversation through another country would be silly.

The cost is real, and I want to be upfront about it. LAN-only means it doesn't work across networks. You can't control your home PC from the office. Some people want that, and for them a remote desktop tool is the right answer, not my app. I'm fine with saying no to that use case. One job per app is a rule I try to keep.

Pair-by-PIN came from the same thinking. Without an account, something has to stop the person on the next sofa (or the next apartment on shared Wi-Fi) from connecting to your PC. A short PIN shown on the PC screen is simple, and it proves you can physically see the computer you're about to control.

## A tray app that should be invisible

The PC side is a small tray program. I wanted it to feel like it isn't there. The installer is around 8.5 MB, and at idle it uses close to zero CPU.

That idle number matters more than people think. A remote app's server runs all day, every day, mostly doing nothing. If it wakes up constantly to check things, you pay for it in battery life on a laptop and fan noise on a desktop, for a feature you use for ten minutes in the evening. So the rule was: when nobody is connected, it waits quietly and does no work it doesn't need to.

I also wanted the input itself to go through the native Windows input functions, so that to Windows, a click from the phone is just a click. Apps behave the way they would with a real mouse, which avoids a whole class of weird bugs.

## Cursor math on Windows is harder than it looks

This is where I spent more time than I planned.

On a single 1080p monitor at 100% scaling, moving the cursor is easy. Finger moves this much, cursor moves that much. Then you add display scaling. Lots of laptops ship at 125% or 150% because the screens are small and sharp. Windows has several ways of telling a program where things are, and depending on how a program declares itself, it might get real pixels or "scaled" pixels that Windows translates behind its back. If the server and Windows disagree about which kind of pixel they're talking about, the cursor moves too fast, too slow, or stops short of the screen edge.

Multiple monitors make it more interesting. Windows treats all your screens as one big virtual desktop. A monitor placed to the left of your main one has negative coordinates. Monitors can be different sizes, sit at different heights, and, the tricky part, use different scaling. A laptop at 150% next to an external monitor at 100% is a very normal setup. The same finger movement has to feel the same on both, and the cursor has to cross from one to the other without jumping.

The lesson I took from this: test on setups that aren't yours. My own desk is one configuration. The world has thousands. Making the server fully DPI aware and treating multi-monitor as the normal case, not an edge case, fixed most of it.

## Discovery, and networks that say no

Ideally you open the app and your PC just appears. Phone Mouse auto-discovers the server on the local network, and on a normal home router that works.

But plenty of networks block it. Guest networks, hotels, offices and university Wi-Fi often use client isolation, which stops devices on the same network from seeing each other at all. Some cheap Wi-Fi extenders don't pass the broadcast messages discovery relies on. VPNs on the phone can swallow the traffic entirely.

I can't fix those networks from inside an app, and I've stopped pretending I can. What I can do is explain it well. That's partly why I wrote a whole guide on [what to do when a phone mouse won't connect](/blog/phone-mouse-wont-connect-fixes/). Good documentation is part of the product, even if no one counts it as a feature.

## The firewall prompt

If I had to pick the single most common kind of support message for this app, it's some version of "the phone can't find my PC". And most of the time the cause is the Windows Defender Firewall prompt that appears the first time the server runs.

People click Cancel because the popup looks alarming. Or they click Allow while Windows thinks their home network is "Public", so the permission doesn't apply where they actually are. Then the app looks broken, and from the user's side it is broken. It doesn't matter that it's technically Windows doing the blocking.

What I learned is that you can't treat this as the user's mistake. It's a predictable step in your setup flow, so you design for it. Tell people before it appears that it's coming and what to click. Explain how to fix it if they clicked the wrong thing. I'd rather spend words on that than on another feature.

## One screen to get started

Setting up a phone-to-PC app means several steps across two devices: install the server, find the phone app, install it, figure out how to pair. Every extra step is a place where people give up.

So the first-run window on the PC shows two things: a QR code that opens the app's Play Store page, and the live pair PIN. Scan the code, install, open the app, type the PIN you're already looking at. Everything you need is on one screen. I think it's the most useful thing in the whole setup, and it involves almost no clever code. Just putting the right things in the right place.

## The rename

The app used to be called Remote Mouse Pro. In version 0.2.2 it became Phone Mouse.

I liked the old name at first. It sounded serious. But it had problems. "Remote mouse" is a crowded phrase with other apps already using it. And having "Pro" in the name of an app that also has a free tier and a separate Pro subscription was confusing, honestly. Pro of what?

Phone Mouse is plain. It says what the thing is: your phone, as a mouse. It's also closer to what people actually type into a search bar. If you look at the URL of the app page on this site, you'll still see "remote-mouse-pro" in it. I left that alone so old links keep working.

The low version number is deliberate too. I'd rather call it 0.2 and have it feel solid than call it 3.0 and disappoint people.

## Free and Pro

Deciding what to charge for is the part I still think about the most. My rule is that the basic job, moving the cursor, scrolling, clicking and typing, has to be free and has to be good. If the free version feels crippled, people uninstall it before they ever find out whether the app is useful to them, and they'd be right to.

Extras that took real work to build, and that only some people need, can go in Pro. Pro is $1.99 a month. If someone only ever uses the trackpad from the couch, I'm happy for them to use the free version forever.

## What I'd tell someone building something similar

Spend less time on the core feature than you think and more on the first five minutes. The cursor moving smoothly is expected. Nobody praises it. But a confusing firewall prompt, a PIN they can't find, or a phone that can't see the PC, those are what decide whether someone keeps your app or deletes it.

If you want to try it, [Phone Mouse](/apps/remote-mouse-pro/) is on Android with a Windows 10/11 server, free to start.
