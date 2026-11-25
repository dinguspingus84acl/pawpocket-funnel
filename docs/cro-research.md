# PawPocket Club — CRO research for cold Meta traffic

Researched November 24, 2026. Every number below is quoted from the linked source. Nothing here is a forecast for PawPocket. Published A/B tests are the tests someone chose to publish.

The offer this research is applied to:

- Same 3-piece Calm & Safe Kit on both funnels (USB-C steam deshedding brush, food-grade silicone suction lick mat, battery-free QR/NFC collar tag).
- The kit is **$49.99** once. Optional VIP is unchecked at checkout: club is **$0.00** for 30 days, then **$29.99/mo** (Version A) or **$19.99/mo** (Version B). Checking it shows a VIP kit price of **$29.99**.
- Version A then renews at **$29.99/mo**. Version B (Whop digital club) renews at **$19.99/mo**.
- PawPocket Club is a wellness membership. It is not insurance and it does not pay claims. The tag has no GPS radio. Guest checkout is $49.99.

## 1. Advertorials and listicles for cold traffic

Cold Meta traffic is mostly unaware or problem-aware. A product page that opens with a brand and a price asks them to buy before they recognize the problem. Presell pages exist to climb that ladder: hook, problem, mechanism, offer. Eugene Schwartz named the awareness stages in *Breakthrough Advertising* (1966). A 2026 teardown of 537 live advertorials spending €12.5M maps those stages onto six beats and says the advertorial and the product page must share one angle, one mechanism, and one offer, with at least three CTAs (after the mechanism, after the proof, after the objections). [Adspends, “How to Write an Advertorial”](https://adspends.com/blog/how-to-write-an-advertorial)

CXL’s landing-page guide says the headline has to repeat the promise in the ad, the page should ask for one action, long pages should repeat that action, and extra navigation leaks the click. [CXL, “How to Build a High-Converting Landing Page”](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/)

CXL’s advertorial guide says the page should read as roughly 70% information and 30% promotion, or the reader feels tricked in the first line. A listicle with a CTA at the end is a valid shape, not a different strategy. [CXL, “Advertorials Can Work—If You Get It Right”](https://cxl.com/blog/advertorials/)

LiftArchive’s collection of 22 published advertorial and listicle tests shows 21 wins and 1 loss, and the pattern they describe is that cold paid traffic converted better on a presell than on a product page or homepage. They also warn that published tests are the ones that worked, and several wins compare a new page with a weak control. Inside that set: Oliver Kenyon’s listicle versus a homepage was reported at +57% revenue; a dog-supplement advertorial angle test (pain relief versus longevity) was reported at +28% CTR. A separate note in the same collection: show the sticky CTA once the reader has reached the first in-page CTA, and drop store chrome that makes the page look like a catalog. [LiftArchive, advertorial and listicle tests](https://liftarchive.com/elements/advertorials-and-listicles/)

A week-over-week launch (not a split test) sent paid traffic to new advertorial pages and reported CPA down 35% at the same spend. The authors flag seasonality and creative changes as alternative explanations. [LiftArchive, Peter Christensen advertorial launch](https://liftarchive.com/test/launched-advertorial-style-landing-pages-paid-traffic/)

What that means here: Version B’s ads already name the 11 p.m. wrapper, the open gate, and the bath. The advertorial has to open on that same picture. Version A’s ad, when it exists, has to use the same sentence as the advertorial variant Jack puts in the URL. `?h=2` and `?h=3` exist so the Meta ad and the H1 can be paired without a new page.

Story slots stay empty. LiftArchive mentions a test that swapped a Trustpilot logo for plain stars and a rating line. We will not add stars, counts, or logos until a real review exists. Sample stories on the pages are labeled Sample story. There is no star total and no review count.

## 2. Product and checkout pages

Baymard’s June 26, 2024 checkout benchmark: the average flow was 5.1 steps and **11.3 form fields**. They write that 17% of users have abandoned because checkout felt too complex, and that most sites only need about 8 fields. In their testing, field count hurt more than step count. On mobile, a second name field is worse because retyping is harder. 89% of benchmarked sites still split the name. [Baymard, “Checkout Optimization: Minimize Form Fields”](https://baymard.com/research-articles/checkout-flow-average-form-fields)

Baymard’s checkout overview says 65% of sites they benchmark score “mediocre” or worse, and that their combined usability sessions show an average large site could gain about a **35% conversion increase** by fixing the checkout issues they list (they also say the average site has 32 of those issues). That 35% is their estimate for a full checkout overhaul at a large retailer, not a result PawPocket should paste into a forecast. [Baymard, cart and checkout usability](https://baymard.com/research/checkout-usability)

Our checkout already asks for one email, one plan, and — only for VIP — one unchecked consent box. Adding a shipping address, a card form, or a second name field on this static demo would fight Baymard’s finding. Express Pay buttons are placeholders under the real button. They stay disabled until a plan is chosen, and VIP still has to check the renewal box. An express button that skips that box would break ROSCA.

A Blend Commerce Shopify test put a sticky Add to Cart on mobile product pages and reported conversion **up 10%**, bounce down 3%, cart clicks up 5%, and add-to-cart rate down 20%. They say the test did **not** reach statistical significance, and they shipped it anyway because the direction held. [Blend Commerce, sticky CTA test](https://blendcommerce.com/blogs/ab-tests-shopify/10-increase-in-conversion-rate) We keep one sticky mobile bar that jumps to the plan choice. It is not a second, hidden price.

A cart-drawer test that made Checkout the only primary button increased checkout clicks and, on the reported numbers, reduced revenue per visitor. The useful lesson is hierarchy: one primary action, the other path as a text link. It is not “remove every decline.” [SplitConvert cart-drawer hierarchy test](https://www.splitconvert.com/cro-wins/more-clicks-more-revenue-why-simplifying-checkout-actions-increased-clicks-but-decreased-sales)

No invented “compare at” prices. The kit price on the page is $49.99. The $29.99 figure is the VIP kit price, and it appears only after the optional club box is checked. The club itself is $0.00 today, then the monthly renewal.

Risk reversal is a standard close on the advertorial anatomy above, and Jack’s Version B blueprint lists a 30-day kit refund as an example policy, not a signed term. The live default is a 60-day happy-pet refund with no need to send the kit back. Jack can replace that sentence later.

## 3. Continuity that can still win the VIP choice

ROSCA (15 U.S.C. §§ 8401–8405) still requires, before a negative-option charge: clear and conspicuous disclosure of the material terms before billing information is taken, express informed consent, and a simple way to stop the charges. The FTC’s 2024 “Click to Cancel” amendments to the Negative Option Rule were vacated in full by the Eighth Circuit on July 8, 2025 (opinion dated in the trade press July 11, 2025) for a procedural failure in the rulemaking. Vacating that rule did not repeal ROSCA. [Cooley, July 11, 2025](https://www.cooley.com/news/insight/2025/2025-07-11-click-to-cancel-just-got-cancelled-eighth-circuit-vacates-entirety-of-ftcs-negative-option-rule) [Federal Register, March 13, 2026, restating the five Section 5 principles and the three ROSCA duties](https://www.federalregister.gov/documents/2026/03/13/2026-04952/rule-concerning-the-use-of-prenotification-negative-option-plans)

The FTC’s 2021 enforcement policy statement, as summarized for autoship sellers, says consent to the negative option should be separate from the rest of the order, a pre-checked box does not count, and cancellation should be at least as easy as signup and in the same medium. [Ecommerce4im summary of ROSCA and the policy statement](https://ecommerce4im.com/ftc-negative-option-and-subscription-rules-for-autoship-brands/)

California Business and Professions Code § 17602 (amended by Stats. 2024, ch. 515, operative language for contracts entered, amended, or extended on or after July 1, 2025) requires the renewal terms in visual proximity to the consent request, affirmative consent before the charge, an acknowledgment the buyer can keep, and an online cancel path. A save offer is allowed on that screen only if a prominently located cancel button stays visible at the same time and actually cancels when used. [California Legislative Information, BPC § 17602](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17602)

So the VIP card can look like the better deal. It cannot be pre-selected, badged “most choose,” or described as free. The comparison table puts “due today” and “after 30 days” on one surface. The checkbox stays unchecked and contains the dollar amount, the date, `PAWPOCKETCLUB*MEMBER`, and the cancel link.

Competitive context, not a claim we make on the page: Pawp’s base membership is widely reported at $99/year for 24/7 access to licensed veterinary professionals, and NerdWallet’s November 17, 2026 review says those vets can’t make diagnoses, with prescriptions sometimes a separate paid visit. Emergency protection is an extra product, not the base plan. [NerdWallet, Pawp review, November 17, 2026](https://www.nerdwallet.com/insurance/pet/pawp-pet-insurance-review) [Pawp Help Center, April 6, 2026](https://help.pawp.com/en/articles/14463252-what-does-my-pawp-membership-include) PawPocket Version A must stay narrower than that: “24/7 licensed veterinary guidance, triage, and second opinions,” plus “a veterinary discount plan at participating clinics,” and only once the B2B contracts exist. Version A is not an emergency fund. Version B never borrows Pawp’s vet sentence.

## 4. Post-purchase upsells

The buyer has already said yes. One offer per screen, the price in the button, a decline link that does not insult them. Darjan Hren’s post-purchase copy note uses “No thanks, complete my order” and rejects “No, I don’t want to save.” [Hren, post-purchase upsell copy](https://hren.io/blog/shopify-post-purchase-upsell-copy)

AfterSell’s docs say Shopify allows at most three accepted post-purchase offers and one product per step, and that a decline path should be a smaller alternative rather than a scolding. Their accept/decline labels inside Shopify Checkout are constrained by Shopify. Our static pages are not inside that checkout, so we can write the labels, and we still keep decline as a real text button, not a second-click trap. [AfterSell post-purchase best practices](https://docs.aftersell.com/aftersell/best_practices)

Order Editing’s one-click guide says the first offer should complete the thing they just bought, the price should be obvious, and urgency should be used only when the offer really dies on that page. We do not add a countdown. The extra offer is another battery-free QR/NFC tag at $9.99, not a second kit. The annual lock-in shows the real math ($29.99 × 12 = $359.88 versus $149, and $19.99 × 12 = $239.88 versus $99). [Order Editing, one-click upsell practices](https://docs.orderediting.com/en/articles/15322117-one-click-upsell-best-practices)

Rework’s upsell note says the price, the new total, and an instant decline should all be visible, and that hiding “No” is a trust failure. The “10x” line in their title is their marketing claim, not a PawPocket result, and it is not used in our copy. [Rework, post-purchase upsells](https://resources.rework.com/libraries/ecommerce-growth/post-purchase-upsells)

## 5. Measurement and speed

Meta’s pixel reference defines the events we stub: `PageView` (base code), `ViewContent` on the presell and product pages, `InitiateCheckout` when someone tries to finish checkout, `Purchase` on the confirmation page with `currency` and `value` required. `AddToCart` is the companion event when the order is actually captured. Pass `eventID` on the pixel call so a future Conversions API event can dedupe. [Meta Pixel reference](https://developers.facebook.com/docs/meta-pixel/reference) [Conversions API parameters, updated November 17, 2025](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/custom-data/) [Conversions API, sending events](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/)

The pixel ID in `assets/funnel.js` is an empty string on purpose. Loading `connect.facebook.net` with a blank ID would 404 and pollute checkout. Paste the ID and the events start.

web.dev’s LCP guide: the hero image has to be in the HTML, not injected later; do not put `loading="lazy"` on the LCP image; set `fetchpriority="high"` and preload that one image as WebP. Lazy-load the rest. More than one or two high-priority images wastes the hint. [web.dev, Optimize LCP](https://web.dev/articles/optimize-lcp)

Baseline mobile Lighthouse on this machine, before this pass (headless Chrome, localhost, huge PNGs, review bar injected by JavaScript):

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| index | 65 | 96 | 100 | 100 | 27.3 s | 0.177 |
| advertorial | 65 | 96 | 100 | 100 | 54.8 s | 0.178 |
| product | 65 | 92 | 100 | 100 | 46.4 s | 0.177 |
| lite/advertorial | 66 | 96 | 100 | 100 | 48.8 s | 0.178 |
| lite/product | 73 | 92 | 100 | 100 | 42.2 s | 0.029 |

Those LCP numbers are the multi-megabyte PNGs. The CLS near 0.18 is the review bar being inserted at the top after parse. Cold traffic should not see that bar. `?bar=1` turns it on for review. `?clean=1` forces it off.

Same method after the image and bar changes:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| index | 89 | 95 | 100 | 100 | 3.5 s | 0.049 |
| advertorial | 91 | 95 | 100 | 100 | 3.3 s | 0 |
| product | 88 | 92 | 100 | 100 | 3.7 s | 0.036 |
| lite/advertorial | 91 | 95 | 100 | 100 | 3.3 s | 0.001 |
| lite/product | 91 | 92 | 100 | 100 | 3.3 s | 0.036 |

Accessibility moving from 96 to 95 is audit-applicability noise (some ARIA checks became “not applicable”), not a new failing control. LCP is still a few seconds on this machine because Lighthouse is running against localhost in a constrained browser. The drop from ~30–55 seconds is the WebP swap.

## Prioritized changes

Impact is for cold Meta traffic. Effort is the edit in this static repo. Compliance items are not optional even when they cost a click.

| Priority | Change | Why | Source | Effort |
| --- | --- | --- | --- | --- |
| 1 | WebP heroes, preload one image, lazy-load the rest, real photo files | LCP was 27–55 s on the baseline | [web.dev LCP](https://web.dev/articles/optimize-lcp) | Low |
| 2 | Review bar off unless `?bar=1` | Removes a leak and the CLS shift | [CXL landing pages](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/) | Low |
| 3 | Advertorial opens on the ad’s scene, with a byline and date, and repeats one CTA | Message match and the six-beat structure | [CXL](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/), [Adspends](https://adspends.com/blog/how-to-write-an-advertorial) | Medium |
| 4 | `?h=` headline variants on both advertorials and both product pages | Lets Jack pair a Meta URL with a headline | Same CXL message-match point | Low |
| 5 | Slim header on the presell and offer pages: one button plus Cancel | Navigation is a leak. Cancel has to stay | [CXL](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/), [BPC § 17602](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17602) | Low |
| 6 | VIP vs Guest table: $29.99 vs $49.99 today, renewal in the same table, VIP card visually first, neither selected | Wins the better offer without a pre-check or a fake “most popular” | [ROSCA via Federal Register](https://www.federalregister.gov/documents/2026/03/13/2026-04952/rule-concerning-the-use-of-prenotification-negative-option-plans) | Medium |
| 7 | Keep the unchecked consent box, descriptor, date, and cancel link | Express informed consent | [BPC § 17602](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17602) | Already built |
| 8 | 60-day happy-pet guarantee under Buy now and in the FAQ | Risk reversal | Blueprint example plus advertorial close in [Adspends](https://adspends.com/blog/how-to-write-an-advertorial) | Low |
| 9 | One email field, express-pay placeholders that cannot skip consent | Field count, thumb-zone primary button | [Baymard form fields](https://baymard.com/research-articles/checkout-flow-average-form-fields) | Low |
| 10 | Upsell: one price, one yes, “No thanks, complete my order” | Respectful one-click OTO | [Hren](https://hren.io/blog/shopify-post-purchase-upsell-copy) | Low |
| 11 | Meta events stubbed, no pixel ID until Jack pastes one | Purchase optimization needs `value` and `currency` | [Meta pixel reference](https://developers.facebook.com/docs/meta-pixel/reference) | Low |
| 12 | Real clinic photo on Version A only. Phone photo on Version B’s club section | The picture has to match the claim | Version B blueprint | Low |

Not doing, on purpose:

- Star ratings, review counts, “most choose,” countdown timers, invented compare-at prices.
- A guarantee written as if it were already the policy.
- Express Pay that bypasses the renewal checkbox.
- Version B copy that mentions a veterinarian on staff, a clinic discount, insurance, or GPS.
- Version A copy that promises a prescription or a diagnosis.
