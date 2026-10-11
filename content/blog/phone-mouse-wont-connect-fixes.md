---
title: "Phone mouse app won't connect to your PC? Try these fixes"
description: "A practical checklist for when a phone remote or mouse app can't find your Windows PC: network, firewall, guest Wi-Fi, VPN, battery saver and lag."
date: "2026-10-11"
category: "Guides"
appName: "Phone Mouse"
appHref: "/apps/remote-mouse-pro/"
---

You installed the phone app. You installed the little program on the PC. And the phone just sits there saying it's searching. Or it connected once, yesterday, and today it can't find anything.

This is the most common problem with any phone-to-PC remote, mine included. The cause is usually boring: the two devices can't actually see each other on the network, or Windows is quietly blocking the connection. Work through this list from the top. The early checks take seconds and fix most cases.

## The two-minute checks

Before changing any settings, rule out the obvious stuff:

- Is the PC program actually running? Look for its icon in the system tray near the clock. Windows hides tray icons, so click the small **^** arrow too. For Phone Mouse, the tray icon should be there whenever the server is running.
- Restart the PC program. Quit it from the tray and open it again.
- Force close the phone app and reopen it.
- Turn Wi-Fi off and on again on the phone.
- If pairing fails rather than discovery, check you're typing the PIN currently shown on the PC. Phone Mouse shows it on the first-run window of the server.

If none of that helps, move on. Restarting five times won't fix a firewall rule.

## Make sure both are really on the same network

"Same Wi-Fi" sounds simple, but there are a few ways to get it wrong without noticing.

**2.4 GHz and 5 GHz are fine.** Many routers broadcast two networks, like "HomeNet" and "HomeNet-5G". If the phone is on one and the PC on the other, but they come from the same router, they're normally on the same local network and can talk. Same goes for a PC on an Ethernet cable and a phone on Wi-Fi from the same router.

**Guest networks are not fine.** A guest network is designed to keep devices away from the main network. If your phone joined "HomeNet-Guest" at some point and stayed there, it can reach the internet but not your PC.

**Different routers are usually not fine.** If you have a second router in another room, or an old router plugged in as an extra access point, it may have created its own separate network. The names might even look similar.

**Mesh systems and extenders can be odd.** Most mesh systems act like one big network. But some extenders, especially cheap ones that create a network like "HomeNet_EXT", don't pass broadcast traffic well. Internet works, discovery fails. Try connecting both devices to the main router.

A quick way to compare: on the PC, open Command Prompt and type `ipconfig`. Note the IPv4 address, for example 192.168.1.23. On the phone, open Wi-Fi settings, tap your network, and look at its IP address. If the first three groups match (192.168.1.x and 192.168.1.y), you're probably on the same network. If one says 192.168.1.x and the other 192.168.0.x or 10.0.0.x, you're not.

## The Windows Firewall prompt

This is the big one. In my experience, more connection problems come from this than from everything else combined.

The first time a server program runs, Windows Defender Firewall pops up a window asking whether to let it communicate on private and public networks. People click Cancel because it looks scary, or they click Allow while their network is marked as Public, which means the permission they gave doesn't apply to the network they're actually on. Either way, the phone's connection gets blocked and nothing tells you.

### Set your home network to Private

Windows labels each network as Public or Private. Public is stricter and meant for cafés and airports. Your home Wi-Fi should be Private.

On Windows 11:

1. Open **Settings > Network & internet**.
2. Click **Wi-Fi** (or **Ethernet** if you're on a cable), then click your network's properties.
3. Under **Network profile type**, choose **Private network**.

On Windows 10:

1. Open **Settings > Network & Internet > Wi-Fi** (or **Ethernet**).
2. Click the name of the network you're connected to.
3. Under **Network profile**, choose **Private**.

Only do this for networks you trust. Don't set a hotel network to Private.

### Allow the app through the firewall

1. Press Start and search for **Allow an app through Windows Firewall**. Open it.
2. Click **Change settings** at the top (you need admin rights).
3. Find the server program in the list. Tick the **Private** box next to it. Tick **Public** only if you really need it on public networks.
4. If it isn't in the list, click **Allow another app**, then **Browse**, and pick the program's .exe file from where it's installed.
5. Click **OK**, then restart the PC program.

If you clicked Cancel on the original prompt, Windows may have created a "block" rule for the program, and block rules win over allow rules. If it still won't connect after the steps above, search Start for **Windows Defender Firewall with Advanced Security**, open **Inbound Rules**, look for entries with the program's name and a red block icon, and delete them. Restart the program and Windows should ask again. This time click Allow.

Antivirus suites with their own firewall can block it too. Look in their settings for a similar list of allowed apps.

## Guest Wi-Fi, hotels and offices: client isolation

Many networks deliberately stop devices from talking to each other. Router settings call it **AP isolation**, **client isolation** or **wireless isolation**. It's normal on guest networks, hotels, cafés, universities and most office Wi-Fi, and it's a good security feature there. It also makes any local remote app impossible.

On your own router, look in the admin page under Wireless or Guest settings and turn it off for your main network. Menus differ a lot, so I can't give exact steps. On a hotel or office network you can't change it, and you shouldn't try to get around your workplace's rules. Use the hotspot trick below instead.

## VPNs break local discovery

A VPN on either device can stop them from finding each other. On the phone, many VPN apps send all traffic through the VPN tunnel, including traffic meant for your own local network, so the phone's "is anyone here?" message never reaches the PC. On the PC, some VPN clients block local network traffic as a safety feature.

Turn the VPN off on both devices and test. If that fixes it, look in the VPN app for a setting called something like **Allow LAN access**, **Local network sharing** or **split tunneling**. Turning that on often lets you keep the VPN and still use the remote.

## Battery saver killing the phone app

If it connects fine but drops after the screen turns off, or you come back after a few minutes and it has to reconnect, it's probably Android's battery management. Some phone brands are aggressive about closing apps in the background.

Go to **Settings > Apps**, find the app, open **Battery**, and set it to **Unrestricted** (the wording varies by brand). On Samsung phones, also check that it isn't in the **Sleeping apps** or **Deep sleeping apps** list under battery settings. And turn off battery saver mode while you're using the remote.

## The mobile hotspot workaround

When the network itself is the problem (hotel, office, a router you can't configure), skip it. Make your own small network.

**Option one:** turn on the hotspot on your phone and connect the PC to it. Now the phone and PC are on a network the phone controls, with no isolation. The catch: if the PC uses the internet during this time, it uses your mobile data. Windows will also probably mark the new network as Public, so set it to Private as described above.

**Option two:** use the PC's hotspot. On Windows 11 go to **Settings > Network & internet > Mobile hotspot** and turn it on, then connect the phone to that network. The PC shares its own connection, so no mobile data is used. Not every PC's Wi-Fi card supports this while also connected to another network, but most do.

## It connects, but it lags

A connected but stuttering cursor is a different problem. The messages are tiny, so it's about delay and dropped packets, not speed.

- **2.4 GHz is crowded.** In an apartment building there may be dozens of networks on 2.4 GHz. If your router has 5 GHz, put the phone (and ideally the PC) on it. 5 GHz has more room and less interference, but shorter range.
- **Distance and walls matter.** A PC two rooms away from the router on a weak Wi-Fi signal adds delay to everything. A cheap Ethernet cable to the PC often fixes lag on the PC side.
- **Microwaves interfere.** Sounds like a joke, but a running microwave oven really does disturb 2.4 GHz Wi-Fi.
- **Phone power saving.** Battery saver mode can slow down network activity on the phone. Turn it off and compare.

If you're setting things up from scratch, my guide on [using your phone as a mouse and keyboard for your PC](/blog/use-your-phone-as-a-mouse-and-keyboard-for-pc/) covers the full process and what to look for in an app.

I build [Phone Mouse](/apps/remote-mouse-pro/), and it's LAN-only by design: no cloud relay, so the phone and PC must be able to see each other on the same network. That's good for privacy, but it means every point above applies to it. If you've gone through the list and it still won't connect, the firewall section is the one I'd check a second time.
