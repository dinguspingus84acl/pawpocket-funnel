# PawPocket Club

A mobile-first, GitHub Pages–ready funnel for **PawPocket Club**. One static site holds both editions:

- **Version A — Full Vet-Backed Edition** at **$29.99/mo**, once B2B veterinary partners are contracted. 24/7 licensed veterinary guidance, triage, and second opinions, plus a veterinary discount plan at participating clinics.
- **Version B — Zero-Outreach Fast-Launch Edition** at **$19.99/mo** on Whop. AI educational helper, Wallet Pet ID, QR scan alerts, and a Breed Care Vault. No live veterinarians and no clinic discounts.

The physical offer in both funnels is the 3-piece **Calm & Safe Kit** (steam deshedding brush, suction lick mat, battery-free QR/NFC collar tag). VIP pays **$29.99** today and receives 30 days of the club. Guest pays **$49.99** once and does not renew.

PawPocket Club is a wellness membership. It is not insurance and it does not pay claims.

## Run it locally

No build step. From this folder:

```bash
python3 -m http.server 41773
```

Open [http://127.0.0.1:41773](http://127.0.0.1:41773).

## GitHub Pages

Push the repository and set Pages to deploy from the **root** of the branch. `.nojekyll` is included so Pages serves the files as-is. Paths are relative, so the site works at a project subpath or at the domain root.

## Pages

| Page | Version A | Version B |
| --- | --- | --- |
| Hub | [index.html](index.html) | [lite/index.html](lite/index.html) redirects to the journal |
| VIP benefits | [club.html](club.html) | [lite/club.html](lite/club.html) |
| Journal | [advertorial.html](advertorial.html) | [lite/advertorial.html](lite/advertorial.html) |
| 5 reasons | [listicle.html](listicle.html) | [lite/listicle.html](lite/listicle.html) |
| Checkout | [product.html](product.html) | [lite/product.html](lite/product.html) |
| Add-ons | [upsell.html](upsell.html) | [lite/upsell.html](lite/upsell.html) |
| Receipt + pet ID | [thank-you.html](thank-you.html) | [lite/thank-you.html](lite/thank-you.html) |
| Cancel | [cancel.html](cancel.html) | [lite/cancel.html](lite/cancel.html) |
| QR tag | [tag.html](tag.html) | shared |

Try a prefilled tag: `tag.html?pet=Milo&breed=Golden%20Retriever`.

## Review bar and headline tests

Cold traffic does not see the Funnel Switcher. It was shifting the page and leaking clicks.

- Add `?bar=1` to show Hub | Version A | Version B | Live QR Tag. Press × to hide it again.
- Add `?clean=1` to force it off.
- Add `?h=2` or `?h=3` on an advertorial or product page to swap the headline and subhead for a Meta split test. `?h=1` is the default.

## Meta events

`assets/funnel.js` has a `META` block. Paste a Pixel ID to load the pixel. Leave `capiEndpoint` pointed at your server, never the access token. Events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase. The same `eventId` is ready for Conversions API dedupe. Nothing fires to Meta until the ID is filled in.

## Checkout rules

On both product pages:

1. The purchase choice is two cards. **VIP** is highlighted and preselected: **$29.99** for the kit plus 30 days of VIP free, then `$29.99/mo` or `$19.99/mo`. **One-time purchase** is **$49.99**.
2. The terms line above the button stays visible while VIP is selected. It names `$0 today for membership`, the renewal amount, `Dec 24, 2026`, `PAWPOCKETCLUB*MEMBER`, and the one-click cancel page, at 14px.
3. An optional extra QR/NFC pet tag is **+$9.99**, with a quantity stepper that starts at 0. The kit itself is one reusable set.
4. **Buy VIP** or **Buy once** writes that choice to `sessionStorage` and continues to add-ons. One-time purchase has no recurring line.

Nothing on this site charges a card. Hook the same screen to a processor when you are ready, and keep the consent payload. The footer line "Static demo checkout — no card is charged on this site" stays hidden unless the URL has `?demo=1`.

The first add-on is another battery-free tag at $9.99. It is skipped when the order already includes extra tags.

## Defaults Jack can edit later

- **Guarantee:** 60-Day Happy Pet Guarantee. Full refund on the kit if you're not happy, no need to send it back.
- **Shipping:** Ships in 1-2 business days. Delivered in 3-7 business days (US). Free US shipping. The PDP fills a real arrival range from today.
- **Reminder:** We email you a reminder 5 days before each renewal.
- **Version A response:** Typical response in under 15 minutes, 24/7.
- **Version B response:** Instant AI guidance answer. AI educational guidance only.
- **ER exam line:** Emergency vet exam fees often run $100-$200+ before any treatment.
- **After cancel:** VIP perks stay active until the end of your current paid period.
- **Stories:** Six sample stories, each labeled Sample story. No star totals, counts, or dates.
- **Meta Pixel:** `YOUR_PIXEL_ID` in `assets/funnel.js`. Replace that string with the real Pixel ID.

Shopper pages do not say that a page "does not place a call" or that the static checkout "does not connect you to a veterinarian." Those notes live in HTML comments on the Version A checkout.

## Cancel

`cancel.html` and `lite/cancel.html` keep **Cancel Membership Immediately** on screen at every step. Pause 1 month, downgrade, and annual are optional and do not gate the cancel button. A one-click cancel writes a reference number and an ISO timestamp.

## What this site will not do

- Invent star ratings, press logos, member counts, or countdown timers. Sample stories are labeled Sample story.
- Call the membership insurance, or describe a self-funded emergency fund. The shopper-facing line is: "It is not insurance and it does not pay claims."
- Claim GPS on the collar tag. It is a battery-free QR/NFC tag.
- Promise online prescriptions or a diagnosis where a state VCPR does not allow it (Version A).
- Claim live veterinarians or clinic discounts anywhere under `lite/` (Version B).

## Photos

Product photos live in `img/` as WebP with JPEG fallback. The clinic photo is Version A only. `ai-pet-portal-phone` is the Version B club image. Heroes are preloaded. Everything below the first image is lazy-loaded.
