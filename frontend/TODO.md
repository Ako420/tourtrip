# Hotel Jr frontend TODO

The pages still to build. Every link below opens the "page not found" screen today. Reference site for animation, data and UI: https://www.trip.com/

**How to use this file**

1. Take the first unchecked task. Tasks are in the suggested build order.
2. Build only that task. Check its "Done when" line, then tick its box.
3. Stop and review before starting the next one.

**Next task: 2.1**

**Rules for every page**

- The page has no code. It calls a screen, and the screen calls components.
- Components and screens use `export default`, and are exported from the single `index.ts` in `src/components` and `src/screens`.
- Colours and fonts come from the global tokens in `src/app/globals.css`.
- Icons come from Font Awesome, through `src/constants/icons.ts`. Images come from Unsplash.
- Data comes through `src/services`, with sample data in `src/data` until the API exists. No data is hardcoded in components.
- Each service checks `isApiLive("<area>")` before calling the API, so a page keeps its sample data until its area is listed in `API_AREAS`. New areas go in the `ApiArea` type in `src/services/http.ts`.
- Forms use Zod in the browser, and again in a server action.
- Keep Hotel Jr's own branding and wording.
- Show only what is real. No invented phone numbers, addresses, awards or staff. Anything not connected yet says so on the page.
- Reads of the session cookie stay inside `<Suspense>`, so public pages stay cached.

**Every "Done when" also includes:** `npx tsc --noEmit`, `npx eslint src` and `npx next build` pass, the page works in the browser, and it has no sideways scrolling at phone width.

## 1. Main pages

#### [x] 1.1 Deals

**Route:** `/deals`, `/deals/[slug]`. **API later:** `GET /deals`, `GET /deals/:slug` (backend 13.5).

- List sale campaigns and hot deals, filtered by product.
- A campaign page shows its details and links to matching results.

**Done when:** a deal opens its campaign page, and "Price alerts" on the flights page no longer leads to a dead link, or is relabelled.

#### [x] 1.2 Rewards

**Route:** `/rewards`. **API later:** `GET /rewards/tiers`, `GET /rewards`, `GET /rewards/coins` (backend 14.9).

- Everyone sees the tiers, rules and perks.
- Signed-in users see their tier, progress and coins once the API exists. Until then the page says this is not connected yet.

**Done when:** signed-out and signed-in users each see the right version.

#### [x] 1.3 Travel Inspiration

**Route:** `/inspiration`, `/inspiration/[slug]`. **API later:** `GET /guides`, `GET /guides/:slug` (backend 19.1).

- Guides by city, with paging, and a page for each guide.

**Done when:** the 11 links to this page work, and a guide opens from the list.

#### [x] 1.4 Flight + Hotel

**Route:** `/packages`, plus results and booking. **API later:** `GET /packages/search`, `POST /packages/bookings` (backend 17.1, 17.2).

- Search form, results, booking form and confirmation, reusing the flight and hotel parts.

**Done when:** a package can be searched and booked on sample data, with the price set on the server.

#### [x] 1.5 Private Tours and Group Tours

**Route:** `/private-tours`, `/group-tours`, `/tours/[slug]`. **API later:** `GET /tours`, `GET /tours/:slug` (backend 18.2).

- Both lists share one screen, with the tour type as the difference.
- The details page shows departures and what is included.

**Done when:** both lists work and a tour opens its details page.

#### [x] 1.6 Cruises

**Route:** `/cruises`, `/cruises/[slug]`. **API later:** `GET /cruises`, `GET /cruises/:slug` (backend 18.4).

- Search by destination and date, then show cruise details and sailings.

**Done when:** a search shows matching cruises and one opens its details page.

#### [x] 1.7 Map

**Route:** `/map`. **API later:** backend phase 19.

- Hotels and attractions on a map, filtered by type.
- Choose the map library first. It may need an API key.

**Done when:** map pins link to the matching hotel or attraction.

## 2. Tools

#### [ ] 2.1 Travel assistant

**Route:** `/assistant`.

- The floating "Ask" button opens this page.
- Decide first: a real AI chat, or a guided help page that points to answers. A real chat needs its own backend task.

**Done when:** the "Ask" button leads to something that works and is honest about what it can do.

#### [ ] 2.2 App download

**Route:** `/app`.

- Explain what the app would offer. There is no app yet, so show no store badges or download links.

**Done when:** the page does not suggest an app can be downloaded today.

#### [ ] 2.3 Currency selector

**Route:** `/currency`, or a menu in the header instead. **API later:** `GET /currencies` (backend 15.5).

- A menu is probably better than a page, because prices should change where you are.

**Done when:** the USD link in the header no longer leads to a dead link, and a chosen currency is remembered.

## 3. Company and help pages

These share one simple content layout, and can reuse `LegalScreen` or a new shared screen. Text with facts about the company needs your input, marked as a placeholder until then.

#### [ ] 3.1 About Hotel Jr

**Route:** `/about`. **Done when:** the page has no invented company facts.

#### [ ] 3.2 News

**Route:** `/news`. **Done when:** the list and its empty state both work.

#### [ ] 3.3 Careers

**Route:** `/careers`. **Done when:** the page has no invented job openings.

#### [ ] 3.4 Service guarantee

**Route:** `/guarantee`. **Done when:** every promise matches the Terms page.

#### [ ] 3.5 More service info

**Route:** `/service-info`. **Done when:** the footer link works, and it links to Customer support instead of repeating it.

#### [ ] 3.6 Accessibility Statement

**Route:** `/accessibility`. **Done when:** the statement matches what the site really does.

#### [ ] 3.7 Security

**Route:** `/security`. **Done when:** the page describes only protections the site really has.

## 4. Partner pages

#### [ ] 4.1 List your property

**Route:** `/list-property`. **API later:** backend 21.4.

- Public application form with Zod. It says when applications are not connected yet, as the support form does.

**Done when:** the form validates, and a demo send says nothing was delivered.

#### [ ] 4.2 Affiliate program

**Route:** `/affiliates`. **API later:** backend phase 21.

**Done when:** the page and application form work as in 4.1.

#### [ ] 4.3 Become a supplier

**Route:** `/suppliers`. **API later:** backend phase 21.

**Done when:** the page and application form work as in 4.1.

## 5. Social links

#### [ ] 5.1 Fix the footer social links

**Links:** `/social/facebook`, `/social/x`, `/social/youtube`.

- These should open real accounts, not become pages. Needs the real addresses, or the links are removed.

**Done when:** no social link leads to "page not found".

## 6. Waiting on the backend

Start these only when their backend task is done.

#### [ ] 6.1 My bookings list

**Needs:** backend phase 10. **Done when:** a signed-in user sees their own bookings, and the menu links to the list.

#### [ ] 6.2 Saved hotels

**Needs:** backend 12.6. **Done when:** hearts save to the account and a saved list shows them.

#### [ ] 6.3 Forgot and reset password

**Needs:** backend 12.3, 12.4. **Done when:** a user can reset a password from the login page.

#### [ ] 6.4 Edit profile and photo

**Needs:** backend 12.1, 12.2. **Done when:** a user can change their details on the account page.
