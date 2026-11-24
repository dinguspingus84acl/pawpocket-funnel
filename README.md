# PawPocket Club

A mobile-first, GitHub Pages–ready funnel for **PawPocket Club**. One static site holds both editions:

- **Version A — Full Vet-Backed Edition** at **$29.99/mo**, once B2B veterinary partners are contracted. 24/7 licensed veterinary guidance, triage, and second opinions, plus a veterinary discount plan at participating clinics.
- **Version B — Zero-Outreach Fast-Launch Edition** at **$19.99/mo** on Whop. AI educational helper, Wallet Pet ID, QR scan alerts, and a Breed Care Vault. No live veterinarians and no clinic discounts.

The physical offer in both funnels is the 3-piece **Calm & Safe Kit** (steam deshedding brush, suction lick mat, battery-free QR/NFC collar tag). VIP pays **$29.99** today and receives 30 days of the club. Guest pays **$49.99** once and does not renew.

PawPocket Club is a wellness membership, not pet insurance.

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
| Hub | [index.html](index.html) | — |
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

1. VIP and Guest radios start **unselected**.
2. VIP reveals a **separate, unchecked** recurring-consent box. The text names the renewal (`$29.99/mo` or `$19.99/mo`), the first billing date (today + 30 days), the descriptor `PAWPOCKETCLUB*MEMBER`, and the one-click cancel page.
3. **Complete Order** writes a consent receipt to `sessionStorage` (plan, exact text, ISO time, receipt ID) and opens **View Underwriting Consent Log**.
4. Guest orders do not ask for recurring consent.

Nothing on this site charges a card. Hook the same screen to a processor when you are ready, and keep the consent payload.

## Cancel

`cancel.html` and `lite/cancel.html` keep **Cancel Membership Immediately** on screen at every step. Pause 1 month, downgrade, and annual are optional and do not gate the cancel button. A one-click cancel writes a reference number and an ISO timestamp.

## What this site will not do

- Invent reviews, star ratings, press logos, member counts, or countdown timers. Empty slots are marked `[INSERT REAL CUSTOMER STORY]` and `[INSERT REAL REVIEW BEFORE LAUNCH]`.
- Call the membership pet insurance, or describe a self-funded emergency fund.
- Claim GPS on the collar tag. It is a battery-free QR/NFC tag.
- Promise online prescriptions or a diagnosis where a state VCPR does not allow it (Version A).
- Claim live veterinarians or clinic discounts anywhere under `lite/` (Version B).

## Photos

Product photos live in `img/` as WebP with JPEG fallback. The clinic photo is Version A only. `ai-pet-portal-phone` is the Version B club image. Heroes are preloaded. Everything below the first image is lazy-loaded.
