// Registry for the free browser tools at /tools/. Each tool has:
//   app/tools/<slug>/page.tsx      thin route, wraps the tool in <ToolLayout>
//   components/tools/<slug>.tsx    the interactive "use client" tool
//   content/tools/<slug>.md        the how-to guide shown under the tool

export const TOOL_CATEGORIES = [
  "Image",
  "PDF",
  "Video & audio",
  "Text & social",
  "Money & math",
  "Sellers",
  "Business",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type ToolIcon =
  | "scan-text"
  | "minimize"
  | "scaling"
  | "repeat"
  | "id-card"
  | "film"
  | "music"
  | "files"
  | "scissors"
  | "image-plus"
  | "qr-code"
  | "message-circle"
  | "type"
  | "cpu"
  | "banknote"
  | "landmark"
  | "percent"
  | "cake"
  | "ruler"
  | "package"
  | "shopping-bag"
  | "key-round"
  | "receipt";

export interface Tool {
  slug: string;
  /** Short name used for H1 and cards */
  name: string;
  /** <title> for search results, should contain the main search phrase */
  seoTitle: string;
  /** Meta description, 120 to 160 chars */
  description: string;
  /** One line under the H1 */
  tagline: string;
  category: ToolCategory;
  icon: ToolIcon;
  /** True when the tool never sends the user's data anywhere */
  local: boolean;
  appName?: string;
  appHref?: string;
  blogSlug?: string;
}

export const TOOLS: Tool[] = [
  // Image
  {
    slug: "image-to-text",
    name: "Image to Text (OCR)",
    seoTitle: "Image to Text Converter (OCR), Free and Private",
    description:
      "Extract text from photos, screenshots and scanned documents for free. The OCR runs in your browser, so your images are never uploaded.",
    tagline: "Pull the text out of a photo, screenshot or scan.",
    category: "Image",
    icon: "scan-text",
    local: true,
    appName: "Phone Mouse",
    appHref: "/apps/remote-mouse-pro/",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    seoTitle: "Compress Images Online (JPG, PNG, WebP), Free",
    description:
      "Shrink JPG, PNG and WebP images without visible quality loss. Batch compress in your browser with no upload, no sign-up and no watermark.",
    tagline: "Make photos smaller without making them look worse.",
    category: "Image",
    icon: "minimize",
    local: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    seoTitle: "Resize Image Online by Pixels or Percent, Free",
    description:
      "Resize images to exact pixel sizes or a percentage, with presets for Instagram, WhatsApp DP, YouTube thumbnails and forms. Runs in your browser.",
    tagline: "Set an exact width and height, or pick a preset.",
    category: "Image",
    icon: "scaling",
    local: true,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    seoTitle: "Convert Images to JPG, PNG or WebP Online, Free",
    description:
      "Convert images between JPG, PNG and WebP in bulk. Fast, free and private: conversion happens on your device and nothing is uploaded.",
    tagline: "Switch between JPG, PNG and WebP in bulk.",
    category: "Image",
    icon: "repeat",
    local: true,
  },
  {
    slug: "passport-photo-maker",
    name: "Passport Photo Maker",
    seoTitle: "Passport Size Photo Maker Online, Free (35x45, 2x2)",
    description:
      "Crop a photo to passport size (35x45 mm, 2x2 inch and more) and get a print-ready sheet with several copies. Free, private, in your browser.",
    tagline: "Crop to the right size and print several copies on one sheet.",
    category: "Image",
    icon: "id-card",
    local: true,
  },

  // PDF
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    seoTitle: "Merge PDF Files Online, Free and Private",
    description:
      "Combine several PDF files into one, in any order you like. Free with no file limits, and your documents never leave your device.",
    tagline: "Join several PDFs into one file, in the order you choose.",
    category: "PDF",
    icon: "files",
    local: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    seoTitle: "Split PDF Online: Extract Pages, Free and Private",
    description:
      "Extract pages or page ranges from a PDF, or split every page into its own file. Works in your browser so private documents stay private.",
    tagline: "Pull out the pages you need, or split every page apart.",
    category: "PDF",
    icon: "scissors",
    local: true,
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    seoTitle: "JPG to PDF Converter: Images to PDF Online, Free",
    description:
      "Turn photos and scans (JPG, PNG, WebP) into a single PDF. Reorder pages, pick A4 or Letter, set margins. Nothing is uploaded.",
    tagline: "Turn photos of documents into one tidy PDF.",
    category: "PDF",
    icon: "image-plus",
    local: true,
  },

  // Video & audio
  {
    slug: "video-to-gif",
    name: "Video to GIF",
    seoTitle: "Video to GIF Converter Online, Free and Private",
    description:
      "Turn a short video clip into an animated GIF. Choose start, length, size and frame rate. Converts in your browser with no upload.",
    tagline: "Cut a moment from a video and loop it as a GIF.",
    category: "Video & audio",
    icon: "film",
    local: true,
    appName: "Flipify",
    appHref: "/apps/android/flipify-ai-video-effects/",
  },
  {
    slug: "video-to-mp3",
    name: "Video to MP3",
    seoTitle: "Extract Audio from Video: Video to MP3 Online, Free",
    description:
      "Extract the audio track from an MP4, MOV or WebM video and save it as MP3. Free, quick and private, the file never leaves your device.",
    tagline: "Save the sound from a video as an MP3.",
    category: "Video & audio",
    icon: "music",
    local: true,
    appName: "Captio",
    appHref: "/apps/android/captio-ai-subtitle-caption/",
  },

  // Text & social
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    seoTitle: "Free QR Code Generator: Link, WiFi, Text, Contact",
    description:
      "Make QR codes for links, WiFi passwords, text, phone numbers and contacts. Custom colors, PNG or SVG download, no sign-up, no expiry.",
    tagline: "QR codes for links, WiFi, contacts and more. They never expire.",
    category: "Text & social",
    icon: "qr-code",
    local: true,
  },
  {
    slug: "whatsapp-link-generator",
    name: "WhatsApp Link Generator",
    seoTitle: "WhatsApp Link Generator: Chat Without Saving Number",
    description:
      "Create a wa.me click-to-chat link for any number, with an optional prefilled message. Message people on WhatsApp without saving their number.",
    tagline: "Open a WhatsApp chat with any number, no contact needed.",
    category: "Text & social",
    icon: "message-circle",
    local: true,
    appName: "Send Direct Message w/o Saving",
    appHref: "/apps/android/send-direct-message-w-o-saving/",
    blogSlug: "whatsapp-message-without-saving-number",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    seoTitle: "Word Counter and Character Counter with Social Limits",
    description:
      "Count words, characters, sentences and reading time as you type, and see how your text fits limits for X, Instagram, YouTube and more.",
    tagline: "Words, characters, reading time and social media limits, live.",
    category: "Text & social",
    icon: "type",
    local: true,
    appName: "Captio",
    appHref: "/apps/android/captio-ai-subtitle-caption/",
  },
  {
    slug: "ai-token-counter",
    name: "AI Token Counter",
    seoTitle: "AI Token Counter for ChatGPT, Claude and Gemini",
    description:
      "Count tokens for ChatGPT models and estimate Claude and Gemini usage before you paste a long prompt. See cost estimates. Runs locally.",
    tagline: "See how many tokens your prompt uses before you send it.",
    category: "Text & social",
    icon: "cpu",
    local: true,
  },

  // Money & math
  {
    slug: "currency-converter",
    name: "Currency Converter",
    seoTitle: "Currency Converter: PKR, USD, AED, SAR, GBP, EUR",
    description:
      "Convert between 150+ currencies with daily updated exchange rates. Quick picks for PKR, USD, AED, SAR, GBP and EUR. Free and simple.",
    tagline: "Daily exchange rates for 150+ currencies.",
    category: "Money & math",
    icon: "banknote",
    local: false,
  },
  {
    slug: "loan-emi-calculator",
    name: "Loan EMI Calculator",
    seoTitle: "Loan EMI Calculator: Car, Home and Personal Loans",
    description:
      "Work out your monthly installment, total interest and full repayment schedule for any car, home or personal loan. Free and instant.",
    tagline: "Monthly installment, total interest and a full schedule.",
    category: "Money & math",
    icon: "landmark",
    local: true,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    seoTitle: "Percentage Calculator: Percent Of, Change, Increase",
    description:
      "Find X% of a number, what percent one number is of another, and percentage increase or decrease. Clear answers with the working shown.",
    tagline: "Every common percentage question, with the working shown.",
    category: "Money & math",
    icon: "percent",
    local: true,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    seoTitle: "Age Calculator: Exact Age in Years, Months and Days",
    description:
      "Calculate exact age in years, months and days from a date of birth, plus total days lived and a countdown to the next birthday.",
    tagline: "Exact age in years, months and days, and your next birthday.",
    category: "Money & math",
    icon: "cake",
    local: true,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    seoTitle: "Unit Converter: Length, Weight, Temperature and More",
    description:
      "Convert length, weight, temperature, area, volume, speed and data units instantly. Includes local units like marla, kanal and tola.",
    tagline: "Length, weight, temperature, area and more, including marla and tola.",
    category: "Money & math",
    icon: "ruler",
    local: true,
  },

  // Sellers
  {
    slug: "amazon-fba-calculator",
    name: "Amazon FBA Calculator",
    seoTitle: "Amazon FBA Profit Calculator: Fees, Margin and ROI",
    description:
      "Estimate Amazon FBA profit after referral fees, fulfillment, storage and shipping. See margin, ROI and break-even price in seconds.",
    tagline: "Profit, margin and ROI after Amazon fees.",
    category: "Sellers",
    icon: "package",
    local: true,
    appName: "Scout - Profit Calculator",
    appHref: "/apps/android/scout-profit-calculator/",
    blogSlug: "amazon-fba-profit-math-explained",
  },
  {
    slug: "daraz-fee-calculator",
    name: "Daraz Fee Calculator",
    seoTitle: "Daraz Commission and Profit Calculator (Pakistan)",
    description:
      "Estimate Daraz commission, payment fee, shipping and tax on a sale, and see your real profit per order. Editable rates for any category.",
    tagline: "What you actually keep from a Daraz sale.",
    category: "Sellers",
    icon: "shopping-bag",
    local: true,
  },

  // Business
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    seoTitle: "Free Invoice Generator: Make a PDF Invoice Online",
    description:
      "Create a clean PDF invoice in a minute. Add your logo, line items, tax and discount, any currency. No account, and nothing is stored.",
    tagline: "A clean PDF invoice in about a minute, no account.",
    category: "Business",
    icon: "receipt",
    local: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    seoTitle: "Strong Password Generator, Random and Secure",
    description:
      "Generate strong random passwords and memorable passphrases using your browser's secure random generator. Nothing is sent or saved.",
    tagline: "Strong random passwords and passphrases, made on your device.",
    category: "Business",
    icon: "key-round",
    local: true,
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
