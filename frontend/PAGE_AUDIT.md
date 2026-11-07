# Hotel Jr page audit

Check every built page against its https://www.trip.com/ page, section by section, then fix the layout, sections and font sizes. One page at a time, as in `TODO.md`.

**How to use this file**

1. Take the first unchecked task.
2. Compare our page with the reference at 1440 x 900 and at 375 x 812. Run `scripts/measure-page.js` on both.
3. Write down each section in the reference, in order. Mark it as built, added, or an exception with a reason.
4. Fix the page, check the "Done when" line, then tick the box.
5. Stop and review before starting the next page.

**Next task: E5**

New pages in `TODO.md` section 3 wait until this audit is finished, so they are built to the corrected pattern.

**Rules**

- Match the structure: the order of sections, what each contains, layout, spacing and font sizes.
- Keep Hotel Jr's own name, logo, colours, wording and photos. Never copy Trip.com's text, images, logos or icons.
- Show only what is real. A section that needs facts we don't have is listed under "Needs your decision", not filled with invented ones.
- All earlier rules still apply: no code in pages, single `index.ts` files, global tokens, Font Awesome, Unsplash, data through services, Zod.

**Every "Done when" also includes:** the section list has no unexplained gaps, sizes follow the type scale, nothing scrolls sideways at phone width, and `npx tsc --noEmit`, `npx eslint src` and `npx next build` pass.

## What the first measurements found

Measured at 1440 wide on 5 November 2026.

**Pages are much shorter than the reference, because sections are missing:**

| Page | Trip.com height | Ours | Sections missing from ours |
| --- | --- | --- | --- |
| Hotels | 5,341 | 1,947 | The whole landing page: ours opens directly on the results list |
| Trains | 8,383 | 1,791 | Operators, trust block, travel by region and country, route lists by region |
| Rewards | 7,130 | 2,475 | Guest vs member, perk comparison, earning, tier boosts, spending coins, how it works, closing call to action |
| Attractions | 4,461 | 2,333 | Large "Recommended for you" product grid |
| Cars | 4,007 | 2,303 | Promo codes, user reviews, top brands, guide, why book, global selection, tips, recommendations |
| Home | 4,252 | 3,459 | App section |
| Flights | 3,894 | 3,698 | Partner airlines, flight status updates |

**Font sizes:** most large headings already match. The differences are smaller than they look:

| Item | Trip.com | Ours | Action |
| --- | --- | --- | --- |
| Page title | 48 (home and flights 40) | 48, and flights is now 40 | Done |
| Section heading | 28 (trains and rewards 32, support 24) | 28 everywhere | Follow each page |
| Hotels page title | 48 | None | Added with the landing page |
| Main text on trains | 16 | 14 | Raise to 16 |
| Main text on rewards | 16 | 14 | Raise to 16 |
| Main text on most other pages | 14, with 16 for titles | 14 | Keep |
| Hotel names in lists | 20 | To measure | Task C1 |
| Hotel prices in lists | 24 | 24 | Keep |

**Why text may still look different at the same size:** Trip.com uses its own font, Trip Geom, and ours is Inter. Trip Geom is their own, so we can't use it. We now use Barlow, the closest free match we compared.

Not measured yet on our side: packages, tours, cruises, deals, support, app and inspiration. Each page's task does this.

## Needs your decision

These sections exist on Trip.com, but real content is missing. Each task stops here for your answer.

| Section | Pages | Options |
| --- | --- | --- |
| Partner airlines, train operators, car brands | Flights, trains, cars | Real partners, fictional sample names marked as samples, or leave out |
| User reviews | Cars | Marked sample reviews, or leave out until real reviews exist |
| Usage stats, such as daily users and ratings | App, trains | Leave out until real |
| Chat, call and emergency help | Support | Assistant link for chat. Phone and emergency need real numbers |
| Countdown on daily deals | Packages | Only with a real end time |
| Flight status updates | Flights | Marked as coming later, or leave out |
| Hotel, booking and checkout pages that need a Trip.com sign-in | Sections D and E | I won't sign in to your account or get around sign-in. Send screenshots, or I use public pages only |

## A. Foundations

Everything else builds on these.

#### [x] A1 Set the type scale

**Files:** `src/app/globals.css`, components using sizes such as `text-[1.75rem]`

- Add named sizes to the global tokens: page title, section title, card title, price, body, small.
- Replace one-off sizes with them, so a size can change in one place.
- Show a sample page in Inter and one close free alternative, for you to choose.

**Done when:** no one-off font sizes remain, and you have chosen the font.

#### [x] A2 Check the shared layout

**Files:** `AppShell`, `Navbar`, `Sidebar`, `TopNavShell`, `Footer`, `FloatingActions`, `SectionHeading`

- Compare header height, sidebar width and items, page width, section spacing, footer columns and card styles.

**Done when:** shared parts match, so page tasks don't repeat this work.

**Left out on purpose:** the footer's "Our partners" and awards rows, "Investor relations" and "About Trip.com Group", because Hotel Jr has none of these. "AI generated personalized content" waits for a page of its own.

## B. Landing pages

| Task | Our page | Reference |
| --- | --- | --- |
| [x] B1 | `/` | https://www.trip.com/ |
| [x] B2 | `/hotels` | https://www.trip.com/hotels/ |
| [x] B3 | `/flights` | https://www.trip.com/flights/ |
| [x] B4 | `/trains` | https://www.trip.com/trains/ |
| [x] B5 | `/attractions` | https://www.trip.com/things-to-do/ |
| [x] B6 | `/cars` | https://www.trip.com/carhire/ |
| [x] B7 | `/packages` | https://www.trip.com/packages/ |
| [x] B8 | `/private-tours` | https://www.trip.com/package-tours/private-tours |
| [x] B9 | `/group-tours` | https://www.trip.com/package-tours/group-tours |
| [x] B10 | `/cruises` | https://www.trip.com/cruises/ |
| [x] B11 | `/deals` | https://www.trip.com/sale/deals/ |
| [x] B12 | `/rewards` | https://www.trip.com/customer/loyalty/ |
| [x] B13 | `/support` | https://www.trip.com/pages/support/ |
| [x] B14 | `/app` | https://www.trip.com/pages/appdownload |
| [x] B15 | `/inspiration` | https://www.trip.com/guide/ |

**Known structure of the reference, in order:**

- **B1 Home:** hero with search, new user offers, inspiration, places, moments, handpicked hotels, app, recommendations. Choosing a destination tile swaps the next sections for that place, with a routes section added. Our routes use sample flight deals, because the tile sections only have those fares. Left out: the "Viewed" and haul tags, which need the visitor's location, and the QR code, store buttons and stats in the app band.
- **B2 Hotels:** hero, welcome offer, what's new, top luxury hotels, budget-friendly properties, trending guest houses. **This is the biggest change:** `/hotels` becomes the landing page, and the current list moves to `/hotels/list`, as on Trip.com. Every link to the list changes too. Done: the old `/hotels?destination=` links redirect to the list. Left out: the app ratings, the price match promise and the discount offer, which we can't back up, and the "Read Reviews" toggle on cards, because sample reviews are only on hotel pages. The offer banner lists what a free account really gives. Our sample data has no guest houses, so that row shows top-rated stays.
- **B3 Flights:** hero, trust, trending, partner airlines, status updates, what's happening, why book, how to book, recommendations. Done with a sticky search. Airlines are sample names, marked as samples. The flight status band is left out and the planned app band sits there instead. The multi-city search option is left out, because booking it needs its own flow.
- **B4 Trains:** hero, operators, trust, Europe by country, Asia by country, popular European routes, popular Asian routes. Done, with a sticky section menu, how to book, guides and a journeys link block, and Africa added as a third region because our sample routes include it. Operators are sample names, marked as samples, so they have no region tabs and no logos. Left out: the Buses tab, the open return option, the no booking fees and price promise strip, the Trustpilot reviews and usage stats, and rail passes and airport express, which we don't sell. The old FAQ is replaced by how to book, because the reference has no FAQ here. Country flags are left out because Font Awesome has none. The Nigeria cards use a general rail photo until a better one is chosen.
- **B5 Attractions:** hero, trending destinations, recommended for you. Done, with the three image banners, four benefits and a picks block added. Recommended rows go by category, not city, because our sample data has about one attraction per city. A search or Explore swaps those rows for the results list on the same page. The new user discount becomes the free account banner, and our banners promise no discount. Left out: current location, the Explore hotels option, and the booked counts, opening hours, distance from downtown, award and trending badges on cards, which our sample data doesn't have.
- **B6 Cars:** hero, promo codes, types, cities, reviews, brands, FAQs, guide, why book, selection, tips, recommendations. Done, with a sticky search and section menu that shows the current section. The promo code becomes the free account banner, because we have no discount. Reviews and suppliers are samples, marked as samples on the page, and suppliers have no logos. Why book, selection and tips sit inside the guide, as on the reference. The driver age picker stays a 25 to 69 checkbox, and the license country is left out because pricing doesn't use it. Types are kept although the reference hid them on this visit, because the plan lists them.
- **B7 Packages:** hero, three benefits, daily deals. Done. Each deal is a real sample search for one adult, so its price matches the booking page, and its discount is our real 6%. The destinations and FAQ sections are removed, because the reference has neither here. Left out: the countdown, because deals have no real end time, the one-way option and the different hotel dates option, because booking them needs their own flow, and the rewards benefit, which we can't back up. The route panel shows city names, because our sample data has no airport codes. `GET /packages/deals` isn't in `backend/TODO.md` yet.
- **B8 and B9 Tours:** hero with search and popular places, destination tabs with tour cards, popular cities, popular global destinations. Private tours also have a "Customize my trip" action. B8 done: the action opens the trip planner. Destination tabs go by region, with an All tab, because we have one tour per city. Popular global destinations link to the other tour type, so its photos don't repeat the cities row. A search swaps the tabs for the results list on the same page. Left out: the booked counts on cards, which our sample data doesn't have. Both tour pages share this screen, so B9 only needs a comparison with its own reference. B9 done: the reference has the same sections and no "Customize my trip" action, so nothing changed. Its hero promises free cancellation, no shopping and guaranteed departure, which we can't back up, so our subtitle stays.
- **B10 Cruises:** hero with search, popular cruises with line tabs and cards. Done. Cruise lines are sample names, and cards show the line where the reference shows the ship, because our sample data has no ships. Lengths stay in nights, not days. "Show all" appears only after a search or filter, because the default list already shows everything, and there is no "See more" because all 8 sample cruises fit on the page. The hero subtitle is removed, as on the reference.
- **B11 Deals:** page title, tabs, campaign cards, about text, popular flights. Done. The hot hotel deals, hot flight deals and coupon sections are removed, because the reference has none of them here. Hot flight deals became the popular flights links, and campaign pages still show their own hotels and flights. Campaign cards use our photos with a text headline, not designed banners. `GET /deals` in `backend/TODO.md` now needs `campaigns`, `about` and `popularFlights`.
- **B12 Rewards:** guest vs member, why join with a tier comparison, extra coins, tier boosts, spending coins, how it works, FAQ tabs, closing call to action. Done, and the page moved to the full-width header with a blue hero. Tiers and coin rates keep our own rules, with the "not connected yet" notes still on the page. Left out: the QR codes and phone mockup, the Services and Deals rows, the gift cards and airport transfers products, and the Terms FAQ tab, because we have no terms for this yet. Tier badges use one Font Awesome gem, not six designs. `GET /rewards/tiers` in `backend/TODO.md` still needs updating to the new `RewardsProgram` shape, where `perks` replaces `plannedPerks`.
- **B13 Support:** hero, service chat with product tabs and question cards, ways to get help, guarantee, how help works, app. Done, and the page moved to the full-width header. Question cards open their answer in place, because we have no live service chat. The help bar links to the assistant, Find bookings, the terms and the message form, with no phone or emergency options, because those need real numbers. "Know the rules before you book" replaces the guarantee, and three written steps replace the video. The app card says the app is planned, with no QR code. Kept although the reference doesn't have them: help topic search and the message form, the only real way to reach us. Left out: the "More FAQ" category chips and the 30-second response claim.
- **B14 App:** hero, summary panel, four benefit cards. Store links stay out until an app exists. Done. The summary panel keeps the "not available yet" notice and links to what works on a phone today, in place of the QR code, store badges and usage stats. The four cards carry a "What we plan to include" heading, so they don't read as features that exist. Font Awesome icons replace the illustration.
- **B15 Inspiration:** featured posts carousel, recent articles, destination and all-articles sections. Done, with the section links under the carousel. All articles keeps the city tabs and paging, which cover the destination section. Recent articles shows one row, not two, because we have 12 sample guides and all articles repeats the newest ones. Left out: the travel experts and popular recommendations sections, because we have no writers or view counts, plus author names and view counts on cards. The carousel has arrows but no dots.

**Done when, for each:** every section in the list is built or has a recorded exception.

## C. Results pages

| Task | Our page | Reference |
| --- | --- | --- |
| [x] C1 | `/hotels/list` | https://www.trip.com/hotels/list?city=58 |
| [x] C2 | `/flights/results` | Flight search results |
| [x] C3 | `/trains/results` | Train search results |
| [x] C4 | `/cars/results` | Car search results |
| [x] C5 | `/packages/results` | Package search results |

**Done when, for each:** filters, sort, card layout, and prices match, with the same sample search on both sites.

**Notes:**

- **C1 Hotel list:** blue search bar that stays on screen, map card, popular filters named after the place, budget, stars, guest rating and amenities, sort box, and Trip-style cards with hotel names at 20. The first booking offer is replaced by what a free account really gives, because we can't back up the discounts. Left out, because our data has none: property type, location, meals, bed type and the other long filter groups, per-card photo slides, per-card map links, Trip Coins lines, "last booked" and "only N left" notes, awards, and the "why book" box with its price match claim. Prices show per night and the stay total, not taxes and fees. Paging stays, not endless scroll.
- **C2 Flight results:** the page moved to the transparent header, with a blue band, a one-row search panel, a full-width date strip, filters on the left, and a dark title bar, sort tabs and compact flight rows on the right. Times are 20 and prices 20. Departure and return stay in one row, not two steps, because our booking takes both legs together. The date strip keeps its "lowest fare per adult" note, because the prices need it. Left out: multi-city, nearby airports, the price graph, price alerts, alliances, stopover and duration filters, airline logos, and row tags such as "Cheapest nonstop" and CO2 figures, which our data doesn't have. Filters stay Recommended, Airlines, Departure time, Stops and Max price.
- **C3 Train results:** **not compared with the real Trip.com results list.** That list only opens by submitting their search form, and there is no public link to it. The page uses the C2 layout, and the rows follow the train times table on their London to Manchester route page: bold times, stations, duration and a button on the right. To check it properly, send a screenshot of their results, or approve one search there. Both legs stay in one row, as in C2, and operators are sample names.
- **C4 Car results:** compared with Trip's real list for Seoul, reached from the "View All" button on their public city page. Blue search bar, grey page, filters in a white card, offer bar, count and sort, car type tiles with real lowest prices, and cards with car name at 20, supplier and rating, features, price per day at 24, total and View deal. Left out, because our data has none: the price histogram, seats, baggage, location, specification, extras and payment filters, pick-up location notes, promotions and the members banner. Driver age stays a checkbox and license country stays out, as in B6. `GET /cars/search` in `backend/TODO.md` now also needs `categories`.
- **C5 Package results:** compared with Trip's real list, reached from a Daily deals card on their packages page. Blue band, search panel, Flight card with its legs, and Hotel card with rows that compare the separate price and the Flight + Hotel price. **The left filter column is left out**, because our sample data has one hotel per city, so filters would have nothing to filter. Add it when there is more hotel data. Also left out: the flight class and baggage filters, the hotel date and search row, the sticky summary, and guest quotes. Change flight stays as three choices on the page, not a separate step. Prices are the total for the group, not per person, as the booking page charges.

## D. Details pages

| Task | Our page | Reference |
| --- | --- | --- |
| [x] D1 | `/hotels/[slug]` | Hotel details |
| [x] D2 | `/attractions/[slug]` | Attraction details |
| [x] D3 | `/tours/[slug]` | Tour details |
| [x] D4 | `/cruises/[slug]` | Cruise details |
| [x] D5 | `/deals/[slug]` | Campaign page |
| [x] D6 | `/inspiration/[slug]` | Guide article |

**Done when, for each:** gallery, section tabs, sections and booking panel match.

**Notes:**

- **D1:** Compared with a Trip hotel page while signed in. Search bar, back link, gallery, overview with price card, offer bar, tabs with price, room filters, reviews, location, amenities, policies and description now follow Trip's order. Left out because we have no data for them: several rates per room, photo sets per room, review summary, restaurant, fine print, questions, price match and a real map. Trip's Save and Share: we have Save only. Only two room filters are real for our data. The top search bar goes to the hotel list, and the bar above the rooms changes dates on this page. Tested with sample data, as the backend was off.
- **D2:** Compared with a Trip tour page while signed in. Now a grey page with white cards: photo, title, price, tags, rating and highlights, then tabs with price, then two columns. Left: date, ticket options, quantity and total, then details and reviews. Right: know before you go, location, and a sticky ticket card. Left out because we have no data for them: more photos (the backend stores one), itinerary timeline, what's not included, booked count, review filters and review photos, questions. Location is kept, though Trip shows it inside the itinerary.
- **D3:** Compared with a Trip group tour while signed in. Now a grey page with white cards: name, rating, photo, facts and highlights on the left, then tabs, a day-by-day itinerary that opens and closes, and what's included. On the right a sticky trip options panel: a calendar of departures with prices (or a start date for private tours), travelers, price, Check availability and Ask about this trip. Tours stay enquiry-only, so Check availability fills the enquiry form below. Left out because we have no data for them: more photos, details with photos, adult and child inclusion tabs, tour reviews, notice, itinerary PDF. Trip's blue band behind the page is also left out, as on the attraction page.
- **D4:** Compared with a Trip cruise while signed in. Now a grey page with white cards: photo beside name, line, rating, departure date and city with more dates to pick from, price and Check availability. Then full-width tabs, highlights, an itinerary table, what's included and the enquiry form. Cruises stay enquiry-only, so Check availability fills the form below. The itinerary shows stops only, as we have no dates or times for each port. Left out because we have no data for them: staterooms and their prices, ship details, travel documents, fee details, policies, cruise reviews and more photos.
- **D5:** Compared with a Trip campaign page while signed in. Now a full-width banner 350 tall, tinted panels with a centred heading, four-across cards and a More link, then a three-column "Why book with Hotel Jr?" row. Trip's cards are all one product with region tabs. Ours group by hotels, flights and tickets, so no tabs. Note: Trip's `/sale/deals/` shows promo codes, hotel, tickets and flight deals when signed in, which B11 did not see.
- **D6:** Compared with a Trip guide while signed in. The dark photo banner is gone. Now the title, byline and date, a line, the intro, a large photo, then the article at full content width with 24px headings, followed by places to stay and things to do. Our title is 32 where Trip's is 34, to stay on the type scale. Left out because we have no data for them: the sale banner at the top, photos through the article, hotel filters, questions and trending searches. More travel guides is kept in place of trending searches.

## E. Booking pages

Each form and its confirmation page.

| Task | Our pages |
| --- | --- |
| [x] E1 | `/hotels/[slug]/book`, `/hotels/[slug]/book/confirmed` |
| [x] E2 | `/flights/book`, `/flights/book/confirmed` |
| [x] E3 | `/trains/book`, `/trains/book/confirmed` |
| [x] E4 | `/cars/book`, `/cars/book/confirmed` |
| [ ] E5 | `/attractions/[slug]/book`, `/attractions/[slug]/book/confirmed` |
| [ ] E6 | `/packages/book`, `/packages/book/confirmed` |

**Done when, for each:** form sections, summary and steps match what can be seen without signing in, or your screenshots. No real booking is made on Trip.com.

**Notes:**

- **E1:** Compared with Trip's booking form while signed in, stopping before payment. Now three steps, plain form sections with 24px headings, and four summary cards: stay, dates, price details, cancellation policy. All booking pages now show the three steps. Hotel bookings stay pay at the property. Left out because we have no data for them: savings and rooms-left note, bed preference, promo code, card payment, price change per night and room selectors, rewards, fine print and extra guests. Trip's confirmation page cannot be seen without booking, so ours only got the new steps and summary.
- **E2:** Compared with Trip's flight form while signed in, stopping at the first step. Now a grey page with a trip card and Change flight, a sticky price details card, a card for each passenger, contact details, and a total above Book now. Trip splits this over four steps with seats and extras. We have one form, so ours keeps the three steps. Left out because we have no data for them: gender and nationality, frequent flyer, adding passengers here, seat selection, extras, promo codes and member offers. The passenger and payment sections are shared, so package booking changes too until E6.
- **E3:** **not compared with Trip's train booking page.** That page only opens by submitting their train search form, which needs your OK, the same as C3. Ours uses the E2 layout: trip card with Change train, sticky price details, lead traveler, a total above Book now. The trip card and total card are now shared with flights. The lead traveler section is shared, so attraction booking changes too until E5.
- **E4:** Compared with Trip's car form, stopping before any details. Now a grey page with white cards: driver details, contact info, how to pay, then Book now. On the right a 300 wide car card and price details. Cars stay pay at the counter. Trip has a car details page before this form, with pick-up, drop-off and price, which we do not have. Left out because we have no data for them: license country, flight number, promo code, card payment and protection levels.

## F. Other pages

| Task | Our page | Reference |
| --- | --- | --- |
| [ ] F1 | `/login`, `/signup` | Trip.com sign-in, viewed but never used |
| [ ] F2 | `/account` | Needs your screenshots |
| [ ] F3 | `/bookings` | Find bookings page |
| [ ] F4 | `/planner` | Trip.com's planner, if public |
| [ ] F5 | `/map` | Trip.com's map, if public |
| [ ] F6 | `/assistant` | Trip.com's assistant, if public |
| [ ] F7 | `/terms`, `/privacy` | Terms and privacy pages |

**Done when, for each:** layout and type match, or the page has no public reference and only the type scale applies.
