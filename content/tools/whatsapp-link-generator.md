This tool makes a WhatsApp click-to-chat link for any phone number. Open the link and WhatsApp starts a chat with that number, even if it isn't saved in your contacts. You can also add a message that gets typed into the chat for you.

I use it all the time for one-off chats: a plumber's number from a flyer, a seller on OLX, a delivery rider who called from a number I'll never need again. Shops and freelancers use the same link (or its QR code) so customers can message them in one tap.

## How to use

1. Pick the country in **Country code**. Pakistan (+92) is selected by default.
2. Type the number in **Phone number**. You can write it the way you normally would, like `0300 1234567`. Spaces, dashes and brackets are cleaned up for you.
3. Optionally write a **Message**. It will appear in the chat box, ready to send or edit.
4. Press **Copy link** to share it, or **Open WhatsApp** to start the chat right away.
5. For print or a shop counter, press **Download QR (PNG)**. Anyone who scans it lands in the same chat.

## How the number is cleaned up

WhatsApp links need the number in full international format, with no plus sign, no spaces and no leading zero. A Pakistani mobile number written as `0300 1234567` becomes `923001234567`. The tool does this step for you:

- It removes spaces, dashes, dots and brackets.
- It drops a single leading 0, because that 0 is only used for calls inside the country.
- If you paste a number that already starts with `+` or `00`, it treats that as the full number and ignores the country picker, so you don't end up with `+92 92...`.
- If the number already starts with the selected country code and is long enough, it won't add the code a second time.

The final link looks like `https://wa.me/923001234567`. With a message it adds `?text=` followed by your text, encoded so spaces, Urdu letters and emoji survive the trip.

## Tips for businesses

Put the link in your Instagram bio, Facebook page button, or Google Business profile. A prefilled message helps a lot here. Something like "Hi, I want to order from your page" tells you where the customer came from, and the customer doesn't have to think about what to write.

For a physical shop, print the QR code at a decent size. Around 3 cm across is the smallest I'd go for a counter card, bigger if people will scan it from a distance. Test it with two or three different phones before printing a hundred copies.

Keep the prefilled message short. Very long messages make a denser QR code that older phone cameras struggle with.

## When the link doesn't work

The most common reason is that the number isn't on WhatsApp at all. WhatsApp will tell you this when the chat opens. The second most common reason is a wrong format, usually a missing country code or an extra digit. Check that a Pakistani mobile number has exactly 10 digits after +92. The tool shows a warning when the length looks off.

If you're on a computer without WhatsApp installed, the link opens WhatsApp Web, and you'll need to link your phone first by scanning its QR code.

## FAQ

### Can I message someone on WhatsApp without saving their number?

Yes. That's exactly what a wa.me link does. Make the link here, open it, and the chat starts without adding a contact.

### Is this free, and is my number sent anywhere?

It's free. The link and the QR code are made in your browser, and the number you type is not uploaded or stored by this site.

### Does it work for WhatsApp Business numbers?

Yes. Business accounts use the same wa.me links, so the link works the same way for them.

### Will the other person know I used a link?

No. The chat looks like any other chat you started. They only see your number and your message.

There's a longer walk-through in my article on [sending a WhatsApp message without saving the number](/blog/whatsapp-message-without-saving-number/).
