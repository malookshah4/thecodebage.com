---
title: "How to message someone on WhatsApp without saving their number"
description: "Use WhatsApp's official click-to-chat link, a prefilled message, or the message-yourself trick to chat with a number you don't want in your contacts."
date: "2026-10-11"
category: "Guides"
appName: "Send Direct Message w/o Saving"
appHref: "/apps/android/send-direct-message-w-o-saving/"
---

You need to send one message to a plumber, a delivery rider, or someone selling a used fridge on OLX. You'll never talk to them again. But WhatsApp, by default, wants them saved as a contact first, and now your phone has 40 contacts called "AC repair" and "Bilal car".

You don't have to do that. WhatsApp has an official way to open a chat with any number, and it takes about ten seconds once you know the format. Here are the methods I use, plus the mistakes that make them fail.

## The official way: a click-to-chat link

WhatsApp supports a simple web link that opens a chat with any number. It looks like this:

`https://wa.me/923001234567`

That's it. The part after `wa.me/` is the phone number in full international format. When you open the link, WhatsApp asks if you want to continue to the chat, and then you're in, with no contact saved.

The format is strict, and this is where most people get stuck:

- Start with the country code (92 for Pakistan, 44 for the UK, 1 for the US and Canada, 971 for the UAE, and so on).
- No plus sign.
- No leading zero from the local number.
- No spaces, dashes, brackets or dots.

So a Pakistani number written locally as **0300 1234567** becomes **923001234567**. You drop the 0, put 92 in front, and squash everything together. The link is `wa.me/923001234567`.

A UK mobile written as 07700 900123 becomes 447700900123. A US number written as (555) 123-4567 becomes 15551234567.

## How to actually open the link

You have a few options, and any of them works.

The easiest on a phone: open Chrome (or any browser), type `wa.me/923001234567` into the address bar, and press Go. The browser hands it to WhatsApp. On some phones you'll see a small page first with a "Continue to Chat" button. Tap it.

On a computer, the same link works if you have WhatsApp Desktop installed or use WhatsApp Web. It'll open the chat there.

You can also paste the link into any notes app and tap it, which brings me to the next trick.

## Add a prefilled message with ?text=

If you want the message already typed when the chat opens, add `?text=` and your message to the end of the link. Spaces have to be written as `%20`, because links can't contain plain spaces.

For example:

`https://wa.me/923001234567?text=Hi%20is%20the%20fridge%20still%20available`

When that opens, the chat box will already contain "Hi is the fridge still available". You still have to press send yourself. WhatsApp never sends anything automatically from these links, which is good.

A few other characters need encoding too. A question mark inside your message becomes `%3F`, and a line break becomes `%0A`. Honestly, for anything longer than a sentence, I just open the chat with the plain link and type normally. The prefilled text is most useful for businesses who put a "Chat with us" link on their website, or for when you send the same opening message to a lot of people (more on that below).

## The message-yourself trick

This one is handy when you already have the number copied, for example from an SMS or a website.

Recent WhatsApp versions have a "Message yourself" chat. Open a new chat and your own name is at the top of the contact list, usually with "(You)" next to it. Paste the number there and send it to yourself. WhatsApp turns phone numbers into tappable links. Tap the number in your own chat and you'll get an option like "Chat with +92 300 1234567". Tap that and the chat opens.

The number usually needs the country code for this to work reliably. If you paste 03001234567, WhatsApp may guess your own country, which is fine if the number is local, and wrong if it isn't.

You can do the same thing in any chat, like a chat with a friend, but sending random numbers to a friend gets confusing fast. The self chat is like a scratchpad nobody else sees.

## Typing a number in the new-chat screen

In recent versions of WhatsApp, you can sometimes skip all of this. Tap the new-chat button and type the full number into the search box. If the number is on WhatsApp, you may see it appear with an option to chat, even though it isn't saved.

I say "sometimes" because this has varied between versions, between Android and iPhone, and between regions, and WhatsApp keeps moving things around. If you don't see it on your phone, update the app and try again, or fall back to the wa.me link, which has worked the same way for years.

## Common mistakes that break it

When someone tells me "the link doesn't work", it's almost always one of these.

1. **Leaving the leading 0.** `wa.me/9203001234567` has an extra 0 after the 92. WhatsApp will say the number isn't on WhatsApp.
2. **Missing the country code.** `wa.me/3001234567` won't work. WhatsApp doesn't know which country you mean.
3. **Including the plus sign.** `wa.me/+923001234567` sometimes works and sometimes doesn't, depending on the browser. Just leave it out.
4. **Spaces or dashes in the number.** Copying "0300-1234567" straight into the link breaks it.
5. **The number really isn't on WhatsApp.** Some people use a different number for WhatsApp than for calls. Nothing you do on your side fixes that.
6. **Using 00 instead of the country code.** Some people write international numbers as 0092... or 0044.... Drop the 00 too.

If you're not sure about a country code, search "[country] dialing code". It takes five seconds and saves the confusion.

## Privacy and some basic manners

Messaging an unsaved number is normal and fine. But a couple of things are worth keeping in mind.

When you message someone, they see your number, and depending on their settings and yours, your name, profile photo and "about" line. Not saving them on your side doesn't hide you from them. If that matters, check Settings, then Privacy, and choose who can see your photo and info.

Please don't use these tricks to message strangers in bulk. The wa.me link makes it very easy to open chats with long lists of numbers, and people do exactly that for promotions. WhatsApp actively bans accounts that send lots of unwanted messages, and lots of people blocking and reporting you is the quickest way to get there. If you're a business, use the WhatsApp Business app or platform properly, and only message people who asked to hear from you.

For one-off messages to a seller, a delivery person, a shop, or a hotel abroad, it's perfect. That's what it's for.

## A shortcut if you do this often

If you message unsaved numbers a lot, building the link by hand every time gets old. I made a small Android app, [Send Direct Message w/o Saving](/apps/android/send-direct-message-w-o-saving/), that does the boring part. You pick the country code, type or paste the number, and it opens the WhatsApp chat for you. It supports all country codes and doesn't collect any data.

To be clear, it isn't affiliated with WhatsApp, and it doesn't do anything you can't do yourself with the link above. It just saves you from typing `wa.me/` and fixing leading zeros twenty times a week. If you only need this once a month, the browser method is completely fine.

If you're the kind of person who gets forwarded a lot of strange videos from those unsaved numbers, I also have a guide on [how to fact-check a viral video](/blog/how-to-fact-check-a-viral-video/) before passing it on.
