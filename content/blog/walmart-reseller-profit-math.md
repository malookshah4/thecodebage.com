---
title: "Walmart Marketplace profit math: WFS vs shipping it yourself"
description: "How Walmart Marketplace fees work for resellers, with an example comparing WFS and self-fulfilled orders, plus approval, buy box and ROI thresholds."
date: "2026-10-11"
category: "Sellers"
appName: "Mart Scout"
appHref: "/apps/android/mart-scout-profit-calculator/"
---

Walmart Marketplace looks a lot like Amazon from far away. You list a product, a customer buys it, the platform takes a cut. Up close the money works a bit differently, and the biggest difference is shipping. On Walmart you have a real choice between letting Walmart fulfill your orders and doing it yourself, and that choice can turn a good deal into a bad one.

I already wrote about the general cost stack for arbitrage in [Amazon FBA profit math](/blog/amazon-fba-profit-math-explained/), so I won't repeat things like sales tax on your buy cost or the difference between margin and ROI. This post is only about what's specific to Walmart.

Same warning as always: Walmart updates its fees and rules. Check the current fee schedule in Seller Center before you trust any number here, including mine.

## Getting approved first

You can't just sign up and start listing on Walmart Marketplace the way you can on some other platforms. You apply, and Walmart reviews the application. In general they want a registered business with a US tax ID, business details and documents, and some sign that you've sold online before, like a history on another marketplace. Requirements change from time to time, and approval can take a while.

This matters for the math because it changes who you're competing with. There are fewer sellers on a typical Walmart listing than on Amazon. That's part of the appeal. It also means some products have no Walmart sellers at all, and some have Walmart itself sitting on the listing.

If you want to use Walmart Fulfillment Services (WFS), that's a separate step. Not every seller or every item is eligible, so check that before planning around it.

## The referral fee

Walmart charges a referral fee on each sale, as a percentage of the total sale price. Like Amazon, it varies by category. For a lot of everyday categories it lands around 15%, and some are lower. A few categories have different rates above a certain price point.

One thing I like about Walmart's model is that there's no monthly subscription fee for the marketplace itself, at least at the time I'm writing this. You pay when you sell. But again, look at the current schedule, because I'd hate for you to plan around something that changed last month.

## WFS: Walmart ships it for you

With WFS, you send inventory to Walmart's warehouses and they handle picking, packing, shipping to the customer, customer service and most of the return process. In exchange you pay:

- A **fulfillment fee** per unit, based mostly on shipping weight (and size for bulky items).
- **Monthly storage**, based on cubic feet, with extra charges if inventory sits too long.
- Your own cost to **ship inventory in** to Walmart's warehouses, plus any prep.

The upside is speed and trust. WFS items can show faster delivery badges, which can help conversion and your shot at the buy box. You also don't spend your evenings taping boxes.

The downside is that slow items get expensive. If something sits for months, storage keeps billing you whether it sells or not.

## Self-fulfilled: you handle everything

The other option is fulfilling orders yourself (people often call this seller-fulfilled or MFN, merchant fulfilled network, borrowing the Amazon term). You keep the item at home or in your own space, and when it sells you pack and ship it.

No fulfillment fee and no storage fee. That sounds cheaper, and sometimes it is. But you pay for:

- **Shipping labels.** Walmart shoppers expect free or cheap shipping, so in practice you often price the shipping into the item and eat the label cost.
- **Packaging.** Boxes, mailers, tape, filler.
- **Returns.** You handle them yourself, often including return shipping.
- **Your time,** and the need to meet Walmart's shipping and on-time delivery standards. Miss those too often and your account health suffers.

For light, small items, self-fulfilled can win. For anything heavy, shipping labels get ugly fast.

## A side-by-side example (illustrative numbers)

Same item as the Amazon post so you can compare: bought for $12 plus 8% sales tax, selling for $29.99. Say it weighs around 2 pounds packed. All of these numbers are **made up for illustration**. Real fees depend on category, weight, dimensions, the current schedule and your shipping rates.

| Line item | WFS | Self-fulfilled |
| :- | -: | -: |
| Sale price | $29.99 | $29.99 |
| Buy cost incl. tax | $12.96 | $12.96 |
| Referral fee (15%) | $4.50 | $4.50 |
| WFS fulfillment fee | $5.45 | none |
| Storage per unit | $0.20 | none |
| Inbound shipping per unit | $0.60 | none |
| Prep and labeling | $0.50 | none |
| Shipping label to customer | none | $7.50 |
| Packaging | none | $0.60 |
| Returns allowance | $0.40 | $0.60 |
| **Total costs** | **$24.61** | **$26.16** |
| **Profit** | **$5.38** | **$3.83** |
| **Margin** | **17.9%** | **12.8%** |
| **ROI** | **41.5%** | **29.6%** |

In this made-up case WFS comes out ahead by about $1.55 a unit, mostly because a retail shipping label for a 2 pound box costs more than Walmart's fulfillment fee. Flip the item to something that weighs 4 ounces and fits in a padded mailer, and self-fulfilled might win instead. There's no single right answer. You have to run both.

And notice that the self-fulfilled ROI dropped just under 30%. That's the kind of deal where a small surprise turns it into a loss.

## The buy box and price competition

Walmart also has a buy box: the seller whose offer shows up when the customer hits "Add to cart." Most sales go to that seller. Walmart doesn't publish exactly how it picks, but price (including shipping), delivery speed and seller performance all seem to play a part.

A few things I've noticed about competing on Walmart:

1. If Walmart itself sells the item, it usually wins the buy box. Getting sales there is hard.
2. Fewer sellers per listing means less constant undercutting than on Amazon, but when a price war starts, it can still drop the price below your profit line.
3. Walmart watches pricing compared to other sites. If your price is way higher than elsewhere, your offer may be less visible or not buyable at all.
4. Delivery speed counts. WFS or fast self-shipping helps.

So when you look at a product, check who has the buy box now, how many sellers there are, and how close their prices are to each other.

## Why ROI thresholds matter even more here

On Walmart I think a minimum ROI is even more useful than on Amazon, for two reasons. First, self-fulfilled shipping costs are less predictable. Label rates change, carriers add surcharges, and a customer in a far zone costs more than one nearby. Second, Walmart listings can have less sales history to go on, so your demand guess is shakier.

A lot of resellers use something like 30% ROI and a few dollars of minimum profit as a floor. That's a common rule of thumb, not advice. The point of a floor is that it leaves room for being wrong. If a deal only works when every estimate is perfect, it doesn't really work.

## Where Mart Scout fits

I made [Mart Scout](/apps/android/mart-scout-profit-calculator/) as the Walmart sibling to my Amazon calculator. You scan a barcode and it estimates the WFS fees (referral, fulfillment, storage) and also does the self-fulfilled shipping math, so you can see both sides like the table above. It shows net profit, margin and ROI, the current buy box seller and the seller count, and gives a FLIP, RISKY or SKIP verdict based on thresholds you set yourself.

The usual honest caveat applies. Fee estimates can be off, prices change after you leave the store, and your real shipping rate depends on your carrier and account. I use the verdict to sort the obvious no's from the maybes, and then I look closer at the maybes before spending real money.

Run both fulfillment options on every item you're serious about. The cheaper one is not always the one you expect.
