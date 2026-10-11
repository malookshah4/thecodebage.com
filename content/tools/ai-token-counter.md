AI models like ChatGPT, Claude and Gemini don't read words. They read tokens, which are chunks of text that can be a whole word, part of a word, a space plus a word, or a single punctuation mark. Prices, rate limits and context windows are all measured in tokens, so knowing the count before you send a big prompt saves money and surprises.

This counter gives exact token counts for OpenAI models, rough estimates for Claude and Gemini, a cost calculator, and a context window check.

## How to use

1. Paste your prompt, document or chat log into **Your prompt or text**. A sample prompt is there so you can see how it works.
2. Read the counts. **GPT-4o and newer** and **GPT-4, GPT-3.5** are exact. **Claude (approx.)** and **Gemini (approx.)** are estimates.
3. Under **Cost estimate**, pick which count to use in **Count input with**, then enter the input and output prices per 1M tokens from the provider's pricing page, and how many tokens you expect back.
4. Under **Context window**, choose the model's context size to see whether your text plus the expected reply fits.
5. Tick **Show how the text is split** to see the first 300 tokens as colored chips.

## Exact counts versus estimates

OpenAI publishes its tokenizers. This page uses the same two encodings in your browser: `o200k_base`, used by GPT-4o and later models, and `cl100k_base`, used by GPT-4 and GPT-3.5. For the raw text, those numbers match what the API counts. In a chat request each message adds a few extra tokens for formatting, so a long conversation will come out a bit higher.

Anthropic and Google don't ship a tokenizer you can run in a browser, so the Claude and Gemini numbers are simple estimates: characters divided by 3.5 for Claude and by 4 for Gemini. For ordinary English prose they land in the right area. For code, tables, Urdu, Hindi, Arabic or Chinese, real counts are usually higher, sometimes a lot higher. If the exact number matters, check the usage figures in your provider's dashboard after a test call.

## Why some text costs more tokens

Common English words are often a single token. Rare words, names, long numbers and typos get broken into several pieces. Turn on the token view and paste a phone number or a product code to see this.

Non-Latin scripts are the big one. Newer tokenizers like `o200k_base` handle Urdu and Hindi much better than older ones, which is why the two OpenAI counts can differ a lot for the same text. You'll sometimes see a � chip in the token view. That just means one character was split across two tokens; the model still reads it fine.

## Working out the cost

The formula is simple:

cost = input tokens × input price ÷ 1,000,000 + output tokens × output price ÷ 1,000,000

Say your prompt is 1,800 tokens and you expect a 500 token reply. If a model charged $2.50 per million input tokens and $10 per million output tokens (made-up round numbers), that's 0.0045 + 0.005 = about $0.0095 per request, or about $9.50 for a thousand of them. Output tokens are usually priced higher than input, so a long reply can cost more than a long prompt.

I left prices blank on purpose. They change often and differ between models, so copy the current ones from the provider's pricing page.

## FAQ

### How many words is 1,000 tokens?

For normal English, roughly 700 to 800 words. A rule of thumb is that one token is about four characters of English text. Other languages and code use more tokens per word.

### Is my prompt sent anywhere?

No. The tokenizer files load once, and then all counting happens in your browser. Your text is never uploaded.

### Why do the GPT-4o and GPT-4 counts differ?

They use different tokenizers. The newer `o200k_base` has a larger vocabulary, so it usually needs fewer tokens, especially for non-English text.

### What happens if my text is bigger than the context window?

The API will reject it or the app will cut off older parts of the chat. Split the text into parts, summarize it first, or use a model with a larger context window.
