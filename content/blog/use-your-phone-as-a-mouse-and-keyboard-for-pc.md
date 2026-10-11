---
title: "How to use your phone as a mouse and keyboard for your PC"
description: "When a phone makes a good PC remote, the main ways to set one up, what to check before installing anything, and a simple Wi-Fi setup that works."
date: "2026-10-11"
category: "Guides"
appName: "Phone Mouse"
appHref: "/apps/remote-mouse-pro/"
---

A wireless mouse costs a few dollars, so using your phone instead sounds a bit silly. But there are plenty of moments when the phone is already in your hand and the mouse is somewhere else. On the desk across the room. Under a cushion. Dead, because nobody bought AA batteries.

A phone makes a decent PC remote for small jobs, the ones where getting up is more annoying than the job itself. It is not a replacement for a real mouse at a desk. This guide covers when it's worth setting up, the different ways to do it, and what to check so you don't end up with something laggy, or worse, something that sends your keystrokes to a server you know nothing about.

## When a phone is actually the better tool

The most common case is a PC plugged into a TV. You're on the couch, a video is playing, and you want to pause it, skip the intro, or open the next episode. A keyboard on your lap works, but it's big and wants a flat surface. A phone trackpad works fine while you're lying down.

A few other situations where it earns its place:

- **Presentations.** You can walk around the room, click to the next slide, and use the cursor as a pointer.
- **A broken or missing mouse.** The USB mouse stopped working, or you're at a relative's house and their PC has only a keyboard. The phone gets you through until you buy a new one.
- **Typing from bed.** Say a download finished and you need to type a file name or a search into the PC. Typing it on your phone and having it appear on the PC is quicker than walking over.
- **Media control.** Volume, play/pause, next track. If the PC is the music box in the room, this alone is worth it.

What it's bad at: games that need precise aim, photo editing, design work, anything where you'd feel a few milliseconds of delay. A real mouse wins there and I don't think any phone app will change that.

## The main options, and how they differ

There are roughly three families of tools, and they work in quite different ways.

**Bluetooth HID.** The phone pretends to be a Bluetooth keyboard and mouse. The PC sees it as normal hardware, so you don't install anything on the computer. Newer Android versions support this and a few apps use it. That's handy on a work PC where you can't install software. The downsides, in my experience: Bluetooth pairing can be fussy, cheap Bluetooth adapters drop out, and you only get what a basic keyboard and mouse can do.

**Wi-Fi apps with a PC server.** You install a small program on the PC and an app on the phone. Both sit on the same Wi-Fi. The phone sends your touches and key presses to the PC program, and the program moves the cursor or presses the keys. This is the most common type. Because there's software on both ends, these apps can add extras like file transfer or saved shortcuts.

**Remote desktop apps.** Chrome Remote Desktop, Microsoft's Remote Desktop, TeamViewer, AnyDesk and so on. These are a different thing. They stream the PC's screen to your phone so you can see it and control it from anywhere, even from another city. Great when you're away from the PC. When you're in the same room, it's overkill: you're squinting at a tiny copy of a screen that's right in front of you, and the video stream adds delay. Many of them also go through the company's servers and need an account.

The rough rule I use: if you can see the PC screen, pick Bluetooth or a Wi-Fi app. If you can't see it, you want remote desktop.

## How the Wi-Fi kind works

You don't need to know this to use one. It does help a lot when something goes wrong, though.

The PC program is a tiny server. It runs in the background, usually as an icon in the system tray near the clock, and waits for the phone. When you open the phone app, it looks for that server on your local network. Most apps do this by sending a small broadcast message that means, more or less, "is anyone here?", and the PC answers. If that fails, better apps let you type the PC's IP address by hand.

Once they find each other there's usually a pairing step, like a PIN shown on the PC that you type on the phone. Don't skip apps that have this. Without pairing, anyone on the same Wi-Fi could move your cursor and type on your computer.

After pairing, the phone just sends small messages: move the cursor 12 pixels right and 4 down, left click, press Ctrl+C. The PC program turns those into real input through the operating system's own input functions, so Windows treats them as if they came from a physical mouse and keyboard. Each message is a few bytes, so bandwidth isn't the issue. What hurts is delay and dropped packets, which is why a busy network can make the cursor stutter even when YouTube plays fine.

## What to check before you install one

Here's what I'd look at, roughly in order:

1. **Where your input goes.** Does everything stay on your local network, or does it pass through a cloud server? For a mouse you use in the same room, there's no good reason for your keystrokes to leave the house. Remember that a keyboard app sees everything you type, passwords included. If the privacy policy is vague about this, I'd move on.
2. **Whether it wants an account.** A mouse app shouldn't need your email address. If it asks, ask yourself why.
3. **Latency.** Test it on your real Wi-Fi. Draw slow circles with your finger and watch the cursor. It should follow smoothly without jumps.
4. **Scrolling.** Two-finger scroll is what you'll use most in a browser. Check that it feels smooth and goes the direction you expect.
5. **Keyboard shortcuts.** Typing letters is easy. The real test is Alt+Tab, Win+D, Alt+F4, Ctrl+Shift+Esc. If the app can't send combinations with modifier keys, you'll hit a wall quickly.
6. **The PC side.** How big is the installer, which Windows versions does it support, and does it use CPU while you're not touching it? A tray app that keeps your fan spinning isn't worth it.
7. **Where you download it.** Get the PC program from the developer's own page, not a random download site. If they publish a checksum, compare it.

## Setting one up, step by step

The details vary between apps, but the flow is nearly always this:

1. Install the phone app from the Play Store or App Store.
2. On the PC, download the server program from the developer's official page and install it.
3. Run it. When Windows Firewall asks whether to allow it, tick **Private networks** and click **Allow access**. Don't click Cancel. This one popup causes more "it won't connect" problems than everything else put together.
4. Check that the phone is on the same Wi-Fi as the PC. Not mobile data, and not the guest network.
5. Open the phone app. It should find the PC by itself. If it doesn't and the app has a manual option, you'll need the PC's IP address: open Command Prompt, type `ipconfig`, and look for "IPv4 Address" under your Wi-Fi or Ethernet adapter. It usually looks like 192.168.1.23.
6. Pair, usually by typing the PIN shown on the PC.
7. Test properly. Move, click, scroll, open Notepad and type a sentence, then try a shortcut like Win+E.

If the phone never finds the PC at step 5, I wrote a separate guide on [what to do when a phone mouse won't connect](/blog/phone-mouse-wont-connect-fixes/). Most of the time it's the firewall, a guest network, or a VPN.

## Where Phone Mouse fits

I make one of these, so read this part with that in mind. [Phone Mouse](/apps/remote-mouse-pro/) is an Android app plus a small Windows tray server, and it works the Wi-Fi way described above. On first run the server shows a QR code to get the app and a pair PIN. The phone finds the PC on your local network and you pair with that PIN. There's no account and nothing goes through a cloud server. Input goes in through Windows' own input APIs, and it handles multiple monitors and display scaling.

Besides the trackpad with two-finger scroll and a keyboard that can send Ctrl, Alt and Win combinations, it has some extras I wanted for myself: a snippet list for text you paste often, file transfer between phone and PC, voice macros, and a camera text scan that reads printed text on the phone and sends it to the PC. You can use it for free, and there's a Pro tier at $1.99 a month.

The limits are real. It's Android and Windows only, and the phone and PC have to be on the same network. It will not control your PC from another city. If that's what you need, a remote desktop tool is the right choice.

Whatever you end up using, test it with a keyboard shortcut and a password field before you rely on it. Moving a cursor is the easy part.
