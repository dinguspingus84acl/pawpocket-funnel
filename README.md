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

1. The kit price is **$49.99**. Quantity defaults to 1.
2. One **unchecked** checkbox adds optional VIP: club is $0.00 today, then `$29.99/mo` or `$19.99/mo`. Checking it also shows the VIP kit price of **$29.99**.
3. The terms under the box name the renewal amount, the first billing date, `PAWPOCKETCLUB*MEMBER`, and the one-click cancel page, at 14px.
4. **Pay now** writes that consent to `sessionStorage` and continues to add-ons. An unchecked box is a one-time kit with no recurring line.

Nothing on this site charges a card. Hook the same screen to a processor when you are ready, and keep the consent payload. The footer line "Static demo checkout — no card is charged on this site" stays hidden unless the URL has `?demo=1`.

Kit quantity defaults to 1 and is not a consent item. Two kits add $19.99 and three add $39.98. The second-kit upsell appears only when quantity is 1.

## Still unconfirmed

These stay as visible placeholders. Do not invent the missing numbers.

- **[CONFIRM GUARANTEE TERMS]** — window, who pays return shipping, and whether an opened brush qualifies. Jack still has to confirm those before the guarantee is advertised. Do not put that sentence in an ad until the words are final.
- **[CONFIRM HANDLING]** business days and **[CONFIRM SHIP WINDOW]**
- Specs: **[CONFIRM battery/run time]** and **[CONFIRM size]**
- **[CONFIRM SLA]** and **[INSERT LOCAL ER EXAM FEE + SOURCE]** stay unused until a sourced comparison is allowed back on the journal
- **[CONFIRM: reminder email wired]** on the day-25 step. Do not promise the reminder email until the billing backend actually sends it.
- **[CONFIRM: you keep access until the end of the period you already paid for.]**
- **[INSERT REAL CUSTOMER STORY]** — three empty cards on checkout. No stars and no counts.

Shopper pages do not say that a page "does not place a call" or that the static checkout "does not connect you to a veterinarian." Those notes live in HTML comments on the Version A checkout.

## Cancel

`cancel.html` and `lite/cancel.html` keep **Cancel Membership Immediately** on screen at every step. Pause 1 month, downgrade, and annual are optional and do not gate the cancel button. A one-click cancel writes a reference number and an ISO timestamp.

## What this site will not do

- Invent reviews, star ratings, press logos, member counts, or countdown timers. Empty slots are marked `[INSERT REAL CUSTOMER STORY]` and `[INSERT REAL REVIEW BEFORE LAUNCH]`.
- Call the membership insurance, or describe a self-funded emergency fund. The shopper-facing line is: "It is not insurance and it does not pay claims."
- Claim GPS on the collar tag. It is a battery-free QR/NFC tag.
- Promise online prescriptions or a diagnosis where a state VCPR does not allow it (Version A).
- Claim live veterinarians or clinic discounts anywhere under `lite/` (Version B).

## Photos

Product photos live in `img/` as WebP with JPEG fallback. The clinic photo is Version A only. `ai-pet-portal-phone` is the Version B club image. Heroes are preloaded. Everything below the first image is lazy-loaded.
