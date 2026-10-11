This tool makes strong random passwords and easy-to-type passphrases. It uses your browser's built-in cryptographic random generator, the same source browsers use for security work, and it never sends or stores what it makes. Close the tab and the passwords are gone.

It also tells you how strong each result is in plain numbers: the entropy in bits and a rough guess at how long a brute force attack would take.

## How to use

1. Choose **Password** or **Passphrase** at the top.
2. For a password, set the **Length** slider (16 is the default) and tick the character types you want: uppercase, lowercase, digits and symbols. Tick **Avoid look-alike characters** if you will ever need to read it out or type it by hand.
3. For a passphrase, set the number of **Words**, pick a **Separator**, and choose whether to **Capitalize each word** and **Add a number**.
4. A new result appears right away. Press **Generate** for another one, or tick **Show 5 at once** to pick from a short list.
5. Press **Copy** and paste it into the sign-up form or your password manager.

## What entropy means

Entropy measures how many guesses an attacker would need in the worst case, written as a power of two. A password with 60 bits of entropy is one of 2^60 equally likely possibilities, which is about a billion billion.

For a random password the math is simple. Take the number of possible characters, find log2 of it, and multiply by the length. With all four character types there are 87 characters here, and log2(87) is about 6.44 bits per character. A 16 character password gives roughly 16 × 6.44 ≈ 103 bits. (The tool's number is a touch lower because it insists on at least one character from each type you tick, and it counts that honestly.)

For a passphrase, each word is picked from a list of about 1,200 words, which is a little over 10 bits per word. Five words give around 51 bits, six give around 62. The separator and capital letters add nothing, because they are fixed choices, not random ones. The optional number adds a few bits.

The **Time to crack** figure assumes an attacker who knows exactly how the password was made and can try ten billion guesses per second. That is a realistic speed for a stolen database protected by a fast hash and a few good graphics cards. Sites that use slow hashes make attacks far slower, so treat this as the pessimistic case.

## Password or passphrase?

Use a long random password when a password manager will remember it for you. That covers most accounts. 16 to 20 characters with all character types is more than enough.

Use a passphrase for the few things you must type from memory: your password manager's master password, your laptop login, maybe your main email. Something like Maple-River-Cobalt7-Tent-Quiz is far easier to remember and type on a phone than a string of symbols. For those, go with at least 6 words.

Whichever you pick, the bigger risk is reuse. One leaked site should never give away the key to another. A unique password for every account matters more than squeezing out a few extra bits.

## FAQ

### Is this password generator safe to use?

The passwords are made in your browser with crypto.getRandomValues, and nothing leaves your device or gets saved. Each character or word is chosen with rejection sampling, so no option is slightly more likely than another.

### How long should my password be?

For accounts saved in a password manager, 16 characters or more. For a memorized passphrase, at least 6 random words.

### Why avoid look-alike characters?

Characters like 0 and O, or 1, l and I, are easy to confuse when reading a password off a screen or paper. Removing them costs a tiny bit of strength, which the entropy number already shows.

### Are passphrases from a word list really secure?

Yes, if the words are picked at random by a computer, not by you. The attacker can know the whole list, and the strength still comes from how many combinations are possible. Words you choose yourself are much easier to guess.
