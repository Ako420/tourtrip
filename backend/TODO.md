# Hotel Jr backend TODO

The full plan for the Hotel Jr backend, split into small tasks so we can do one at a time.

**How to use this file**

1. Take the first unchecked task in section 6. Tasks are in dependency order.
2. Build only that task. Check its "Done when" line, then tick its box.
3. Stop and review before starting the next one.

**Next task: 0.2**

**Where the plan comes from**

- **The frontend in `frontend/src`.** Its services, types and Zod schemas already define the API it expects, so those shapes are the contract. Phases 1 to 6 build exactly that.
- **The reference site, https://www.trip.com/.** Its hotels, trains, cars and attractions pages were read on 2026-11-04 and shaped phases 7 to 12. We take the feature ideas only, and keep Hotel Jr's own branding, copy and data.
- **Gap:** trip.com's flights page redirected to a verification check, so it wasn't read. The flight tasks come from the frontend only. Its sign-in, Flight + Hotel, Planner, Deals and Rewards pages weren't read either, so those phases are our own design.

---

## 1. Where we are today

| Area | Status |
| --- | --- |
| Stack | Node 24, Express 5, Prisma 7 with `@prisma/adapter-pg`, PostgreSQL 18, ES modules |
| Layers | `routers` → `controllers` → `services`, plus `middlewares` and `config` |
| Working endpoints | `GET /`, `GET /api/health`, `GET /api/rooms`, `POST /api/rooms` |
| Database | `hotel_jr` has one migration and one empty `Room` table |
| Error handling | `notFound` and `errorHandler` exist, and P2002 returns 409 |
| Missing | Validation library, auth, tests, seed data, and every endpoint the frontend calls |

**Problems to fix along the way**

- `Room` doesn't match the frontend. It's a physical room with a `number` and no hotel, while the frontend needs room types that belong to a hotel. The frontend never calls `/api/rooms`, so task 2.1 replaces both.
- The project isn't in a git repository (task 0.1).
- The frontend's `http.ts` never sends the session token, so logged-in requests can't work yet (task 1.5).
- `http.ts` ignores error response bodies and only keeps the status code (task 5.7).
- `GET /hotels/:slug` is called without dates, so room availability can't reflect the guest's stay yet (task 5.5).
- Setting `API_URL` in the frontend switches **every** service to the API at once. Until phases 1 to 5 exist, pages would fail, so that switch waits for task 5.8. Test earlier tasks with automated tests or `curl`.

---

## 2. Decisions

These are the defaults this plan uses. Tell me before the related task if you want any of them changed.

| # | Decision | Why |
| --- | --- | --- |
| 1 | JavaScript with ES modules, no TypeScript | Matches the current backend |
| 2 | Keep `router → controller → service`, and add validators and mappers | Extends the current layout without a rewrite |
| 3 | Zod for validation | The frontend already uses it, so the rules can match |
| 4 | String `cuid()` ids on new tables | Frontend types use `id: string` |
| 5 | JWT Bearer token, 7 day expiry | The frontend stores `{ token }` in a 7 day `session` cookie |
| 6 | bcrypt for passwords, cost 12 | The frontend already caps passwords at 72 characters, which is bcrypt's limit |
| 7 | Flights use our own fictional schedules and fares | The frontend's sample airlines are fictional. Real fares would need a paid provider such as Amadeus or Duffel |
| 8 | No online payment until task 8.6 | The booking forms say payment isn't connected, and hotel policy says cards are accepted at the property |
| 9 | Guests can book without an account | The booking forms don't need a login, and trip.com also finds bookings by email |
| 10 | Prices are always recalculated on the server | A client-sent `total` is only ever compared, never trusted |
| 11 | USD only until task 8.7 | All sample data is USD |

---

## 3. Architecture and conventions

### Folder layout

```text
backend/
  prisma/
    schema.prisma
    migrations/
    seed.js
    seed-data/            JSON exported from the frontend sample data
  src/
    app.js                Express app, middleware and routes
    server.js             Starts the server
    config/               db.js, env.js
    routers/              <name>.router.js, one per resource, joined in index.js
    controllers/          <name>.controller.js, read the request and send the response
    services/             <name>.service.js, business rules and Prisma queries
    validators/           <name>.validator.js, Zod schemas
    mappers/              <name>.mapper.js, database row → API shape
    middlewares/          errorHandler, notFound, validate, auth, rateLimit
    utils/                httpError.js, dates.js, money.js, pagination.js, reference.js
  tests/                  <name>.test.js
```

### Request flow

```text
router → validate(schema) → requireAuth (when needed) → controller → service → Prisma
                                                                        ↓
                                               controller ← mapper ← database row
```

- **Router:** paths and middleware only.
- **Controller:** reads `req.validated`, calls one service, sends the response. No Prisma here.
- **Service:** rules and queries. It throws `HttpError` and knows nothing about `req` or `res`.
- **Mapper:** turns rows into the exact shape in `frontend/src/types`.

### Rules that apply to every task

- **Express 5 catches async errors**, so controllers don't need `try/catch`. This is already how the current code works.
- **Don't assign to `req.query`.** It's read-only in Express 5. The `validate` middleware stores parsed values on `req.validated`.
- **Register fixed paths before parameters.** `/hotels/search` must come before `/hotels/:slug`, and `/flights/search` before anything with `:id`.
- **Query booleans:** use `z.enum(["true", "false"]).transform((value) => value === "true")`. `z.coerce.boolean()` turns the text `"false"` into `true`.
- **Query lists:** hotel `stars` and `amenities` are comma separated. Flight `stops`, `airlines` and `departure` are separated by `|`, because the frontend's query builders do this.
- **Money:** `Decimal(10, 2)` columns. Do price sums with Prisma's `Decimal`, not JS floats. Prices may reach the frontend as strings, which it accepts.
- **Ratings:** `Float` columns. The frontend does number comparisons on `rating`, so it must not be a Decimal string.
- **Dates:** stay and flight dates are `@db.Date` and go over the API as `YYYY-MM-DD`. Timestamps are ISO 8601.
- **Trusted data:** prices, room details and availability always come from the database, never from the request.
- **The API is called by the Next.js server**, not the browser. Two things follow:
  - CORS isn't needed yet.
  - Every request arrives from the same IP, so rate limits on sensitive routes must key on something else, such as the email address.

### Responses

Success responses match the frontend types directly, with no `{ data: ... }` wrapper.

Errors keep the current `message` field and add a `code`:

```json
{
  "message": "This room has just sold out.",
  "code": "ROOM_SOLD_OUT",
  "errors": [{ "path": "checkIn", "message": "Enter a valid date" }]
}
```

`errors` only appears on validation failures.

| Status | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 204 | Success with no body |
| 400 | Failed validation or a broken business rule in the input |
| 401 | Missing or invalid token, or wrong login details |
| 403 | Logged in but not allowed |
| 404 | Not found |
| 409 | Conflict: duplicate email, sold out, price changed, can't cancel |
| 429 | Too many attempts |
| 500 | Unexpected error, details logged and never sent |

---

## 4. Database design

Models are grouped by the phase that adds them. Every table also has `createdAt`, and those that change have `updatedAt`.

### Phase 1: accounts

**User:** `id`, `fullName`, `email` (unique, lowercase), `passwordHash`, `phone?`, `role` (`USER` or `ADMIN`)

### Phase 2: hotels

**Hotel:** `id`, `slug` (unique), `name`, `area`, `city`, `country`, `address`, `description`, `imageUrl`, `images String[]`, `highlights String[]`, `stars Int`, `rating Float`, `reviewCount Int`, `pricePerNight Decimal` (lowest room price), `originalPrice Decimal?`, `currency`, `freeCancellation`, `breakfastIncluded`, `sortRank Int`, `reviewScores Json`, `policies Json`, `nearby Json`

Indexes: `city`, `pricePerNight`, `rating`.

`reviewScores`, `policies` and `nearby` are `Json` because they're only displayed and never filtered on.

**Amenity:** `id` (text such as `wifi`), `label`, `iconName`. Many-to-many with Hotel.

**RoomType** (replaces `Room`): `id`, `hotelId`, `name`, `beds`, `maxGuests`, `pricePerNight`, `isAvailable`, `imageUrl`, `sizeSqm`, `freeCancellation`, `breakfastIncluded`, `totalRooms`

**Review:** `id`, `hotelId`, `userId?`, `bookingId?` (unique), `author`, `country`, `score Float`, `stayDate` (text such as `October 2026`), `title`, `text`

### Phase 3: page content

**ContentBlock:** `key` (unique, `home` or `flights`), `data Json`

### Phase 4: flights

**Airport:** `id`, `code` (unique), `city` (unique), `country`

**Airline:** `id`, `code` (unique), `name`

**FlightSchedule:** `id`, `airlineId`, `flightNumber`, `aircraft`, `fromAirportId`, `toAirportId`, `departMinutes`, `durationMinutes`, `stops`, `stopCity?`, `baseFare Decimal`, `checkedBag`, `refundable`, `seatsPerCabin`, `returnScheduleId?`

Index: `(fromAirportId, toAirportId)`.

**FlightDeparture:** `id`, `scheduleId`, `date @db.Date`, `cabin`, `seatsBooked`. Unique on `(scheduleId, date, cabin)`. A row is created the first time a seat is sold, so seats left is `seatsPerCabin - seatsBooked`.

**FlightDeal:** `id`, `airlineId`, `fromCity`, `toCity`, `departDate`, `returnDate`, `cabin`, `isNonstop`, `price`, `currency`, `isActive`

### Phase 5: bookings

**Booking:** `id`, `reference` (unique), `userId?`, `type` (`HOTEL` or `FLIGHT`, more later), `status` (`CONFIRMED` or `CANCELLED`), `paymentStatus` (`UNPAID`, `PAID` or `REFUNDED`), `email` (lowercase), `phone`, `total Decimal`, `currency`, `cancelledAt?`

Indexes: `userId`, `email`.

**HotelStay:** `bookingId` (unique), `hotelId`, `roomTypeId`, `checkIn @db.Date`, `checkOut @db.Date`, `rooms`, `adults`, `children`, `firstName`, `lastName`, `arrivalTime?`, `specialRequests?`, `pricePerNight` (copy at booking time), `freeCancellation` (copy at booking time)

Index: `(roomTypeId, checkIn, checkOut)`.

**FlightTrip:** `bookingId` (unique), `offerId`, `outboundScheduleId`, `inboundScheduleId?`, `tripType`, `fromCity`, `toCity`, `departDate`, `returnDate?`, `adults`, `children`, `cabin`, `refundable` (copy at booking time)

**Passenger:** `id`, `flightTripId`, `type` (`ADULT` or `CHILD`), `firstName`, `lastName`, `birthDate @db.Date`

The copied fields keep old bookings correct when prices or policies change later.

### Later phases

| Phase | Models |
| --- | --- |
| 7 | `PasswordResetToken`, `Favorite` |
| 8 | `Promotion`, `UserPromotion`, `RewardTransaction`, `Payment`, `ExchangeRate` |
| 11 to 12 | One catalogue model per product, a detail table beside `Booking`, plus `Trip`, `TripItem`, `SupportTicket`, `PropertyApplication` |

---

## 5. Endpoint reference

All paths start with `/api`. **Auth** values: none, optional, user, admin.

### 5.1 System

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/health` | none | exists | API and database status |

### 5.2 Auth and account

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/auth/signup` | none | 1.2 | Create an account |
| POST | `/auth/login` | none | 1.3 | Log in |
| GET | `/auth/me` | user | 1.4 | Current user |
| PATCH | `/users/me` | user | 7.1 | Update name and phone |
| POST | `/users/me/password` | user | 7.2 | Change password |
| POST | `/auth/forgot-password` | none | 7.3 | Email a reset link |
| POST | `/auth/reset-password` | none | 7.3 | Set a new password with the link's token |

`POST /auth/signup`

```json
// Body
{ "fullName": "Ada Obi", "email": "ada@example.com", "password": "secret123" }
// 201
{ "token": "<jwt>" }
// 409 when the email is taken. The frontend shows its own message for this status.
```

`POST /auth/login`

```json
// Body
{ "email": "ada@example.com", "password": "secret123" }
// 200
{ "token": "<jwt>" }
// 401 when the email or password is wrong
```

### 5.3 Hotels

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/destinations` | none | 2.4 | City names for the search box |
| GET | `/hotels` | none | 2.4 | Plain hotel list for the home page |
| GET | `/hotels/search` | none | 2.5, 2.6 | Search, filter, sort, paginate |
| GET | `/hotels/:slug` | none | 2.7 | Full hotel details |
| GET | `/hotels/:slug/similar` | none | 2.8 | Six hotels nearest in price |
| GET | `/hotels/:slug/reviews` | none | 7.6 | Paginated reviews |
| POST | `/hotels/:slug/reviews` | user | 7.6 | Review a finished stay |

`GET /destinations` returns `string[]`.

`GET /hotels` takes optional `destination` and returns `HotelSummary[]`.

`GET /hotels/search` query:

| Param | Type | Notes |
| --- | --- | --- |
| `destination` | text | Case-insensitive match on name, city or country |
| `checkIn`, `checkOut` | `YYYY-MM-DD` | Used for availability from task 5.5 |
| `rooms`, `adults`, `children` | number | 1-8, 1-16, 0-10 |
| `minPrice`, `maxPrice` | number | On `pricePerNight` |
| `stars` | list | Comma separated, `5,4` |
| `minRating` | number | 0-10 |
| `amenities` | list | Comma separated, hotel must have **all** of them |
| `freeCancellation`, `breakfast` | `true` | Sent only when on |
| `sort` | text | `recommended` (default), `price-asc`, `price-desc`, `rating` |
| `page` | number | Default 1, page size 5 |

Response:

```json
{
  "items": [],
  "total": 12,
  "page": 1,
  "pageCount": 3,
  "priceRange": { "min": 95, "max": 460 },
  "amenities": [{ "id": "wifi", "label": "Free Wi-Fi", "iconName": "wifi" }]
}
```

`items` are `HotelSummary`. `page` is capped at `pageCount`, and `pageCount` is at least 1. `priceRange` and `amenities` are worked out from all hotels matching the destination **before** filters, so the filter panel stays stable while filters change.

`HotelSummary`:

```json
{
  "id": "…", "slug": "azure-cliff-resort", "name": "Azure Cliff Resort",
  "area": "Uluwatu", "city": "Bali", "country": "Indonesia", "imageUrl": "…",
  "stars": 5, "rating": 9.2, "reviewCount": 1284,
  "pricePerNight": "189.00", "originalPrice": "229.00", "currency": "USD",
  "amenities": [{ "id": "pool", "label": "Pool", "iconName": "pool" }],
  "freeCancellation": true, "breakfastIncluded": true,
  "featuredRoom": { "name": "Garden Room", "beds": "1 king bed" }
}
```

`GET /hotels/:slug` returns `HotelSummary` plus `address`, `description`, `images`, `highlights`, `rooms`, `reviewScores`, `reviews` (latest 5), `policies` and `nearby`. It returns 404 for an unknown slug. From task 5.5 it also accepts optional `checkIn` and `checkOut`.

### 5.4 Page content

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/home` | none | 3.2 | `HomeContent` for the home page |
| GET | `/flights/content` | none | 3.2 | `FlightsContent` for the flights page |

### 5.5 Flights

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/airports` | none | 4.5 | City names for the search box |
| GET | `/flights/deals` | none | 4.5 | Deals, filtered by `from`, `to`, `nonstop` |
| GET | `/flights/search` | none | 4.6 to 4.8 | Search, filter, sort, paginate |
| GET | `/flights/offers/:id` | none | 4.9 | One offer, using the same search params |

`GET /flights/search` query:

| Param | Type | Notes |
| --- | --- | --- |
| `from`, `to` | text | City names |
| `tripType` | text | `round-trip` or `one-way` |
| `departDate`, `returnDate` | `YYYY-MM-DD` | `returnDate` for round trips |
| `adults`, `children` | number | 1-9, 0-8 |
| `cabin` | text | `Economy`, `Premium Economy`, `Business`, `First` |
| `nonstop` | `true` | Removes other flights before everything else |
| `stops` | list | Separated by `\|`, `2` means 2 or more |
| `airlines` | list | Separated by `\|` |
| `departure` | list | `morning`, `afternoon`, `evening`, `night`, separated by `\|` |
| `maxPrice` | number | On `totalPrice` |
| `refundable`, `checkedBag` | `true` | Sent only when on |
| `sort` | text | `best` (default), `cheapest`, `fastest`, `earliest` |
| `page` | number | Default 1, page size 6 |

Response:

```json
{
  "items": [],
  "total": 15, "page": 1, "pageCount": 3, "currency": "USD",
  "priceRange": { "min": 310, "max": 980 },
  "airlines": [{ "name": "Savanna Air", "lowestPrice": 310 }],
  "fareCalendar": [{ "date": "2026-12-03", "lowestPrice": 290 }],
  "sortSummary": { "best": "$420", "cheapest": "$310", "fastest": "6h 20m" }
}
```

`items` are `FlightOffer`. `priceRange` and `airlines` use all offers before filters, except `nonstop`. `fareCalendar` covers 3 days either side of `departDate`. `sortSummary` uses filtered offers and is omitted when nothing matches.

### 5.6 Bookings

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/bookings` | optional | 5.4 | Book a hotel stay |
| POST | `/flights/bookings` | optional | 5.6 | Book a flight |
| GET | `/bookings` | user | 6.1 | My bookings, `?page`, `?status` |
| GET | `/bookings/:reference` | user | 6.2 | One of my bookings |
| POST | `/bookings/lookup` | none | 6.3 | Find a booking by reference and email |
| POST | `/bookings/:reference/cancel` | optional | 6.4 | Cancel a booking |

`POST /bookings`

```json
// Body
{
  "firstName": "Ada", "lastName": "Obi", "email": "ada@example.com", "phone": "+234 800 000 0000",
  "arrivalTime": "15:00", "specialRequests": "Quiet room",
  "slug": "azure-cliff-resort", "roomId": "…",
  "checkIn": "2026-12-10", "checkOut": "2026-12-13",
  "rooms": 1, "adults": 2, "children": 0,
  "total": 567, "currency": "USD"
}
// 201
{ "reference": "HJ-7K2M9QXA" }
```

`POST /flights/bookings`

```json
// Body
{
  "offerId": "…", "from": "Lagos", "to": "London", "tripType": "round-trip", "isNonstop": false,
  "departDate": "2026-12-10", "returnDate": "2026-12-20",
  "adults": 1, "children": 0, "cabin": "Economy",
  "passengers": [{ "type": "adult", "firstName": "Ada", "lastName": "Obi", "birthDate": "1990-04-02" }],
  "email": "ada@example.com", "phone": "+234 800 000 0000",
  "total": 638, "currency": "USD"
}
// 201
{ "reference": "HJ-7K2M9QXA" }
```

`GET /bookings/:reference` and `POST /bookings/lookup`:

```json
{
  "reference": "HJ-7K2M9QXA", "type": "HOTEL", "status": "CONFIRMED", "paymentStatus": "UNPAID",
  "total": "567.00", "currency": "USD", "createdAt": "2026-11-04T15:00:00.000Z", "canCancel": true,
  "hotel": {
    "slug": "azure-cliff-resort", "name": "Azure Cliff Resort", "imageUrl": "…", "roomName": "Garden Room",
    "checkIn": "2026-12-10", "checkOut": "2026-12-13", "rooms": 1, "adults": 2, "children": 0
  }
}
```

Flight bookings have `flight` instead of `hotel`, holding the trip details and passenger names.

Booking error codes, all status 409: `ROOM_SOLD_OUT`, `SEATS_UNAVAILABLE`, `PRICE_CHANGED`, `NOT_CANCELLABLE`.

### 5.7 Favourites, promotions, rewards, payments, currency

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/favorites` | user | 7.4 | My saved hotels |
| PUT | `/favorites/:hotelId` | user | 7.4 | Save a hotel |
| DELETE | `/favorites/:hotelId` | user | 7.4 | Remove a saved hotel |
| GET | `/promotions` | none | 8.1 | Active offers |
| POST | `/promotions/:id/claim` | user | 8.2 | Claim an offer |
| GET | `/users/me/promotions` | user | 8.2 | My claimed offers |
| POST | `/promotions/validate` | optional | 8.3 | Preview a code's discount |
| GET | `/rewards` | user | 8.5 | Points balance and tier |
| GET | `/rewards/transactions` | user | 8.5 | Points history |
| POST | `/payments/intents` | optional | 8.6 | Start paying for a booking |
| POST | `/payments/webhook` | signed | 8.6 | Payment provider updates |
| GET | `/currencies` | none | 8.7 | Supported currencies and rates |

### 5.8 Admin

All need the admin role.

| Method | Path | Task | Purpose |
| --- | --- | --- | --- |
| POST, PATCH, DELETE | `/admin/hotels`, `/admin/hotels/:id` | 9.2 | Manage hotels |
| POST, PATCH, DELETE | `/admin/hotels/:id/rooms`, `/admin/rooms/:id` | 9.2 | Manage room types |
| GET, PATCH | `/admin/bookings`, `/admin/bookings/:reference` | 9.3 | View and update bookings |
| GET | `/admin/users` | 9.3 | List users |
| PUT | `/admin/content/:key` | 9.4 | Edit page content |
| POST, PATCH, DELETE | `/admin/flights/deals`, `/admin/flights/deals/:id` | 9.4 | Manage deals |
| POST, PATCH, DELETE | `/admin/promotions`, `/admin/promotions/:id` | 9.4 | Manage offers |
| GET | `/admin/stats` | 9.5 | Bookings and revenue summary |

### 5.9 Reference site products

The sidebar already links to these, but none of the pages exist yet. Each one needs a frontend page too.

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/trains/stations` | none | 11.1 | Station names |
| GET | `/trains/search` | none | 11.1 | From, to, date, return, passengers, railcards |
| GET | `/trains/offers/:id` | none | 11.1 | One journey |
| POST | `/trains/bookings` | optional | 11.2 | Book a train |
| GET | `/cars/locations` | none | 11.3 | Pick-up and drop-off places |
| GET | `/cars/search` | none | 11.3 | Locations, times, driver age, licence country |
| GET | `/cars/:id` | none | 11.3 | One rental offer |
| POST | `/cars/bookings` | optional | 11.4 | Book a car |
| GET | `/attractions` | none | 11.5 | Search, with Recommended, Attractions, Experiences tabs |
| GET | `/attractions/:slug` | none | 11.5 | Details and ticket options |
| POST | `/attractions/:slug/bookings` | optional | 11.6 | Book tickets |
| GET | `/packages/search` | none | 11.7 | Flight + Hotel offers |
| POST | `/packages/bookings` | optional | 11.7 | Book a package |
| GET | `/tours`, `/tours/:slug` | none | 11.8 | Private and group tours, `?type=` |
| GET | `/cruises`, `/cruises/:slug` | none | 11.8 | Cruises |
| POST | `/enquiries` | optional | 11.8 | Ask about a tour or cruise |
| GET | `/deals` | none | 12.1 | Offers across all products |
| GET | `/guides`, `/guides/:slug` | none | 12.2 | Travel inspiration |
| GET | `/map/hotels` | none | 12.3 | Hotels inside a map area, `?bbox=` |
| GET, POST | `/trips` | user | 12.4 | Trip planner list and create |
| GET, PATCH, DELETE | `/trips/:id` | user | 12.4 | One saved plan |
| POST | `/trips/:id/items` | user | 12.4 | Add a stop to a plan |
| DELETE | `/trips/:id/items/:itemId` | user | 12.4 | Remove a stop |
| GET | `/support/faqs` | none | 12.5 | Help articles |
| POST | `/support/tickets` | optional | 12.5 | Contact support |
| GET | `/support/tickets` | user | 12.5 | My support requests |
| POST | `/property-applications` | none | 12.6 | "List your property" form |

---

## 6. Tasks

### Phase 0: Foundation

#### [x] 0.1 Put the project in git

- Run `git init` in `hotel-Jr`, and add a root `.gitignore` covering `node_modules`, `.env` and `.env.*` with an exception for `.env.example`.
- Make a first commit of the current state.

**Done when:** `git status` is clean and `git ls-files | grep '\.env$'` prints nothing.

#### [ ] 0.2 Validate environment variables

**Files:** `src/config/env.js`, `.env.example`, `.env`, `src/config/db.js`, `src/server.js`

- Install `zod`.
- Parse `PORT`, `DATABASE_URL`, `JWT_SECRET` (32+ characters), `JWT_EXPIRES_IN` (default `7d`) and `NODE_ENV`. Exit with a clear message if any are wrong.
- Use `env` instead of `process.env` elsewhere.
- Update `.env.example`. It currently names a `hotel_jr` database user that doesn't exist, so change it to `postgres`.
- Generate a secret with `openssl rand -hex 32`.

**Done when:** removing `JWT_SECRET` stops the server with a message naming the variable.

#### [ ] 0.3 Add an `HttpError` and improve the error handler

**Files:** `src/utils/httpError.js`, `src/middlewares/errorHandler.js`

- `new HttpError(status, message, code)`.
- The handler returns `{ message, code, errors? }`.
- Handle `ZodError` as 400, P2002 as 409 and P2025 as 404.

**Done when:** a test route that throws `HttpError(409, "x", "Y")` returns exactly that, and an unexpected error returns a plain 500 with no details.

#### [ ] 0.4 Add the validation middleware

**Files:** `src/middlewares/validate.js`, `src/utils/validators.js`

- `validate({ body, query, params })` parses each part and stores results on `req.validated`.
- Add shared helpers: `isoDate`, `queryBoolean`, `commaList`, `pipeList`, `page`.

**Done when:** an invalid request returns 400 with a field-level `errors` list.

#### [ ] 0.5 Add security and logging middleware

**Files:** `src/app.js`

- Install `helmet` and `morgan`. Limit JSON bodies with `express.json({ limit: "100kb" })`.
- Skip CORS for now, since only the Next.js server calls this API.

**Done when:** responses carry helmet headers and requests appear in the log.

#### [ ] 0.6 Set up tests

**Files:** `tests/health.test.js`, `tests/helpers.js`, `.env.test`, `package.json`

- Install `supertest` and use Node's built-in test runner.
- Create a `hotel_jr_test` database with `sudo -u postgres createdb hotel_jr_test`.
- Add `.env.test`, plus scripts:
  - `"test": "node --env-file=.env.test --test \"tests/**/*.test.js\""`
  - `"test:db": "node --env-file=.env.test node_modules/.bin/prisma migrate deploy"`
- Tests import `app` from `src/app.js`, so no port is needed.

**Done when:** `npm test` passes a `GET /api/health` test against the test database.

---

### Phase 1: Authentication

#### [ ] 1.1 Add the User model

- Add `User` and a `Role` enum to the schema.
- Run `npx prisma migrate dev --name add_users`.

**Done when:** the `User` table exists with a unique email.

#### [ ] 1.2 Build `POST /auth/signup`

**Files:** `validators/auth.validator.js`, `services/auth.service.js`, `controllers/auth.controller.js`, `routers/auth.router.js`, `utils/token.js`

- Install `bcrypt` and `jsonwebtoken`.
- Copy the rules from `frontend/src/schemas/signup.ts`: name 2-100, password 8-72 with a letter and a number. Also check the password is at most 72 bytes.
- Lowercase and trim the email.
- Hash with cost 12, create the user, return `{ token }` with status 201.
- JWT payload: `{ sub: user.id, role: user.role }`.
- Never return `passwordHash`.

**Done when:** tests cover success (201), duplicate email in a different case (409) and a weak password (400).

#### [ ] 1.3 Build `POST /auth/login`

- Return the same 401 message for an unknown email and a wrong password.
- Add a limiter with `express-rate-limit`: 10 failed tries per 15 minutes, **keyed on the lowercased email**, because all requests come from the Next.js server's IP.

**Done when:** tests cover success, wrong password, unknown email and the 429 limit.

#### [ ] 1.4 Add auth middleware and `GET /auth/me`

**Files:** `middlewares/auth.js`

- `requireAuth` reads `Authorization: Bearer <token>`, verifies it, sets `req.user`, or returns 401.
- `optionalAuth` does the same but continues as a guest when there's no token. A present but invalid token still returns 401.
- `requireAdmin` returns 403 unless the role is `ADMIN`.
- `GET /auth/me` returns `{ id, fullName, email, phone, role }`.

**Done when:** tests cover a valid, a missing and an expired token.

#### [ ] 1.5 Send the session token from the frontend

**Files:** `frontend/src/services/http.ts`

- Read the `session` cookie with `cookies()` from `next/headers` and add the `Authorization` header when present.
- Keep `http.ts` free of client-side imports, as it's used by server code only.
- Add `apiPut`, `apiPatch` and `apiDelete` when later tasks need them.

**Done when:** the frontend builds, and the header is sent when a `session` cookie exists. A full login test comes in task 5.8.

---

### Phase 2: Hotel catalogue

#### [ ] 2.1 Replace `Room` with the hotel models

- Add `Hotel`, `Amenity`, `RoomType` and `Review` as in section 4, and remove `Room`. The table is empty, so nothing is lost.
- Delete `room.router.js`, `room.controller.js` and `room.service.js`, and remove the route from `routers/index.js`.
- Run `npx prisma migrate dev --name hotel_catalogue`.

**Done when:** the migration applies, the server starts, and `/api/rooms` returns 404.

#### [ ] 2.2 Export the sample data and seed the database

**Files:** `prisma/seed-data/hotels.json`, `prisma/seed.js`, `prisma.config.js`

- With a one-off `npx tsx` script in `frontend`, write the `hotels` array to JSON. Don't keep the script.
- Add `seed: "node prisma/seed.js"` under `migrations` in `prisma.config.js`.
- Seed amenities, hotels, room types and reviews with `upsert`, so running it twice is safe.
- `pricePerNight` is the lowest room price. `sortRank` keeps the sample order. `totalRooms` starts at 5.
- Keep the sample's `rating` and `reviewCount`.

**Done when:** `npx prisma db seed` runs twice with no duplicates and the row counts match the sample.

#### [ ] 2.3 Build the hotel mapper

**Files:** `mappers/hotel.mapper.js`, `tests/hotel.mapper.test.js`

- `toHotelSummary(hotel)` and `toHotelDetails(hotel)`.
- `featuredRoom` is the cheapest available room.
- Hide `sortRank` and other internal fields.

**Done when:** a test confirms the keys match `HotelSummary` and `HotelDetails`.

#### [ ] 2.4 Build `GET /hotels` and `GET /destinations`

**Files:** `services/hotel.service.js`, `controllers/hotel.controller.js`, `routers/hotel.router.js`, `routers/destination.router.js`

- `destinations` is the sorted list of distinct hotel cities.
- `hotels` matches `destination` case-insensitively on name, city or country.

**Done when:** `?destination=bali` returns the Bali hotels and `/destinations` returns city names.

#### [ ] 2.5 Build `GET /hotels/search` filters, sorting and paging

**Files:** `validators/hotel.validator.js`, `services/hotelSearch.service.js`, `utils/pagination.js`

- Build the Prisma `where` from each filter. For amenities use `AND: ids.map((id) => ({ amenities: { some: { id } } }))`, so a hotel needs all of them.
- Sort `recommended` by `sortRank`, or by the price or rating field for the others.
- Page size 5. Cap `page` at `pageCount`, and keep `pageCount` at 1 or more.
- Register this route above `/:slug`.

**Done when:** tests cover each filter, each sort, an empty result, and a `page` beyond the end.

#### [ ] 2.6 Add `priceRange` and `amenities` to the search

- Run a second query on the destination alone, before filters.
- Return `{ min: 0, max: 0 }` and an empty list when no hotels match.

**Done when:** applying a filter doesn't change `priceRange` or `amenities`.

#### [ ] 2.7 Build `GET /hotels/:slug`

- Include amenities, rooms and the latest 5 reviews. Throw 404 for an unknown slug.

**Done when:** the response matches `HotelDetails` and an unknown slug returns 404.

#### [ ] 2.8 Build `GET /hotels/:slug/similar`

- Six other hotels, closest in `pricePerNight`.
- Order with raw SQL: `ORDER BY ABS("pricePerNight" - $1)`.

**Done when:** the result leaves out the hotel itself and has 6 or fewer items.

---

### Phase 3: Page content

#### [ ] 3.1 Add `ContentBlock` and seed it

- Add the model and migrate.
- Export `homeContent` and `flightsContent` from the frontend to `prisma/seed-data/content.json`, using the same one-off approach as task 2.2.
- `iconName` values must exist in `frontend/src/constants/icons.ts`.

**Done when:** two rows exist with keys `home` and `flights`.

#### [ ] 3.2 Build `GET /home` and `GET /flights/content`

**Files:** `services/content.service.js`, `controllers/content.controller.js`, `routers/content.router.js`

- Return `data` as is. Register `/flights/content` before any `/flights/:x` route.

**Done when:** both responses match the sample data exactly.

---

### Phase 4: Flight search

#### [ ] 4.1 Add the flight models

- Add `Airport`, `Airline`, `FlightSchedule`, `FlightDeparture` and `FlightDeal`, then migrate.

**Done when:** the migration applies.

#### [ ] 4.2 Seed the flight data

- 14 airports from `frontend/src/data/airports.ts`, and the 4 fictional airlines from `flightOffers.ts`.
- For each pair of cities, create schedules each way, linked with `returnScheduleId`.
- Move the sample's deterministic `hash` logic into the seed, so times and fares look the same.
- Add the 12 deals from `flightDeals.ts`. Move any past dates forward.

**Done when:** every ordered city pair has schedules, and seeding twice creates no duplicates.

#### [ ] 4.3 Build fare calculation

**Files:** `services/flightPricing.service.js`, `tests/flightPricing.test.js`

- Pure functions, no database:
  - Cabin multipliers: Economy 1, Premium Economy 1.6, Business 3.2, First 5.
  - Round trip factor 1.8.
  - A repeatable day factor from the route and date.
  - Child fare is 75% of the adult fare.
- `pricePerAdult` is rounded, and `totalPrice = round(pricePerAdult * (adults + children * 0.75))`.

**Done when:** tests prove the same input gives the same price, and cover each cabin, one-way and children.

#### [ ] 4.4 Build the offer builder

**Files:** `services/flightOffer.service.js`, `mappers/flight.mapper.js`

- Turn schedules into `FlightOffer` objects for a given search.
- Offer id is `<outboundScheduleId>` for one-way and `<outboundScheduleId>_<inboundScheduleId>` for round trips, so it stays the same between requests.
- `seatsLeft` comes from `FlightDeparture`, and is only included when 5 or fewer remain.

**Done when:** the same search always gives the same ids and prices, and the shape matches `FlightOffer`.

#### [ ] 4.5 Build `GET /airports` and `GET /flights/deals`

- Airports return sorted city strings.
- Deals filter on `from` and `to` with case-insensitive text matching, and on `nonstop`. Leave out inactive and past deals.

**Done when:** `?from=lagos&nonstop=true` returns only matching deals.

#### [ ] 4.6 Build the basic `GET /flights/search`

**Files:** `validators/flight.validator.js`, `services/flightSearch.service.js`, `controllers/flight.controller.js`, `routers/flight.router.js`

- Require `from`, `to` and `departDate`, and require `returnDate` after `departDate` for round trips. `from` and `to` must differ.
- Return empty results for an unknown city, not an error.
- Apply `nonstop` first.
- Return all offers with paging, size 6.

**Done when:** a Lagos to London search returns offers, and bad dates return 400.

#### [ ] 4.7 Add flight filters and sorting

- Filter in memory, because prices are calculated rather than stored.
- `stops`: `min(stops, 2)` must be in the list, on the outbound leg.
- `departure`: morning 6-12, afternoon 12-18, evening 18-24, night 0-6, on the outbound hour.
- Sorts:
  - `best`: lowest `totalPrice + travelMinutes * 0.5`
  - `cheapest`: lowest `totalPrice`
  - `fastest`: lowest `travelMinutes`, both legs combined
  - `earliest`: lowest `outbound.departMinutes`

**Done when:** tests cover each filter and sort, with results matching the frontend's sample logic.

#### [ ] 4.8 Add the flight search summaries

- `priceRange` and `airlines` come from offers before filters.
- `fareCalendar` is 7 days, using 90% of the cheapest fare per day.
- `sortSummary` holds strings such as `$1,204` and `6h 20m`, built from filtered offers.

**Done when:** the response has all the fields of `FlightSearchResult`.

#### [ ] 4.9 Build `GET /flights/offers/:id`

- Takes the same search params as the search, and rebuilds the offer from its schedule ids.
- Returns 404 for a bad id or a schedule that doesn't match the route.

**Done when:** an id from a search returns the same offer at the same price.

---

### Phase 5: Bookings

#### [ ] 5.1 Add the booking models

- Add `Booking`, `HotelStay`, `FlightTrip`, `Passenger` and their enums, then migrate.

**Done when:** the migration applies.

#### [ ] 5.2 Add the booking helpers

**Files:** `utils/reference.js`, `utils/dates.js`, `utils/money.js`

- `generateReference()` returns `HJ-` plus 8 random characters from `crypto.randomInt`, leaving out `0`, `O`, `1` and `I`.
- `nightsBetween`, `isoToDate`, `dateToIso` and `isPastDate`, which compares against yesterday so guests ahead of the server's time zone can book today, as the frontend does.
- `samePrice(a, b)` allows a 1 cent difference.

**Done when:** unit tests cover these.

#### [ ] 5.3 Build the room availability check

**Files:** `services/availability.service.js`

- Load stays for the room type that overlap the dates, with status `CONFIRMED`: `checkIn < requestedCheckOut AND checkOut > requestedCheckIn`.
- Count rooms taken for **each night** and use the busiest night. Summing overlapping bookings would overstate it, because two bookings might not share a night.
- `getRoomsLeft(tx, roomTypeId, checkIn, checkOut)` returns `totalRooms - busiestNight`.

**Done when:** tests cover overlapping, touching (checkout day equals check-in day) and separate stays.

#### [ ] 5.4 Build `POST /bookings`

**Files:** `validators/booking.validator.js`, `services/booking.service.js`, `controllers/booking.controller.js`, `routers/booking.router.js`

Steps, in order:

1. Validate the body, matching `bookingSchema` and `bookingStaySchema`.
2. Load the hotel by slug and the room by id. Return 404 if missing or the room belongs to another hotel.
3. Check `checkOut > checkIn`, the check-in isn't past, and `adults + children <= maxGuests * rooms`.
4. Work out `pricePerNight * nights * rooms`. If it differs from the sent `total`, return 409 `PRICE_CHANGED`.
5. In a transaction, lock the room row with `SELECT id FROM "RoomType" WHERE id = $1 FOR UPDATE`, so two guests can't take the last room.
6. Check `getRoomsLeft`. If it's too low, return 409 `ROOM_SOLD_OUT`.
7. Create `Booking` and `HotelStay`, with `userId` when logged in. Retry on a reference collision.
8. Return 201 with `{ reference }`.

**Done when:** tests cover guest and logged-in booking, a wrong total, each rule above, and two simultaneous bookings for the last room where only one succeeds.

#### [ ] 5.5 Make hotels date-aware

- With `checkIn` and `checkOut`, `GET /hotels/:slug` sets each room's `isAvailable` from `getRoomsLeft`, using the requested `rooms` count.
- `GET /hotels/search` leaves out hotels with no room available for those dates and party size.
- Frontend: pass dates in `getHotelBySlug`, so the booking page's `checkRoom` sees real availability.

**Done when:** after filling a room for a date, it shows unavailable for those dates and available for others.

#### [ ] 5.6 Build `POST /flights/bookings`

Steps, in order:

1. Validate the body, including one passenger per traveller and the age rules: adults 18+, children 2-17 on the departure date.
2. Rebuild the offer from `offerId` and the search values, returning 404 if it's gone.
3. Check the departure date isn't past, and compare `total` against the rebuilt price.
4. In a transaction, for each leg, `upsert` the `FlightDeparture` row, then run `updateMany` with `seatsBooked: { lte: capacity - seats }` and `{ increment: seats }`. If it updates 0 rows, return 409 `SEATS_UNAVAILABLE`.
5. Create `Booking`, `FlightTrip` and `Passenger` rows.
6. Return 201 with `{ reference }`.

**Done when:** tests cover guest booking, a wrong total, a bad passenger count, an underage adult, and the last seats being taken by simultaneous requests.

#### [ ] 5.7 Show real booking errors in the frontend

**Files:** `frontend/src/services/http.ts`, `frontend/src/actions/booking.ts`, `frontend/src/actions/flightBooking.ts`

- Make `ApiError` keep the response's `code`.
- Show specific messages for `ROOM_SOLD_OUT`, `SEATS_UNAVAILABLE` and `PRICE_CHANGED`.

**Done when:** a sold-out room shows a clear message on the booking page.

#### [ ] 5.8 Switch the frontend to the API

- Add `API_URL=http://localhost:5000/api` to `frontend/.env.local`.
- Test in the browser: home, hotel search and filters, hotel details, hotel booking, flights, flight search and filters, flight booking, sign up, log in.
- Fix any shape differences on the backend.

**Done when:** every flow above works with the data coming from PostgreSQL.

---

### Phase 6: Managing bookings

#### [ ] 6.1 Build `GET /bookings`

**Files:** `mappers/booking.mapper.js`

- The logged-in user's bookings, newest first, with `?page` and `?status`. Leave out other users' bookings.

**Done when:** tests confirm users only see their own.

#### [ ] 6.2 Build `GET /bookings/:reference`

- Return 404, not 403, when it belongs to someone else, so references can't be probed.
- `canCancel` follows the rules in task 6.4.

**Done when:** owner gets 200 and another user gets 404.

#### [ ] 6.3 Build `POST /bookings/lookup`

- Body is `{ reference, email }`. Use POST, so personal details don't go in URLs or logs.
- Return the same 404 for a wrong reference and a wrong email.
- Rate limit by reference.

**Done when:** a guest can find a booking, and wrong details return 404.

#### [ ] 6.4 Build `POST /bookings/:reference/cancel`

- Logged-in owners need nothing else. Guests send `{ email }`.
- Hotels: allowed only if the stay has `freeCancellation` and check-in is more than 48 hours away, matching the sample policy text.
- Flights: allowed only if `refundable` and before departure. Reduce `seatsBooked` in the same transaction.
- Otherwise return 409 `NOT_CANCELLABLE`. Cancelling twice also returns this.

**Done when:** tests cover each rule, and cancelled rooms and seats can be booked again.

#### [ ] 6.5 Send confirmation emails

**Files:** `services/email.service.js`

- Install `nodemailer`. In development, log the email instead of sending it, unless SMTP settings exist.
- Send after booking and after cancelling. An email failure must not fail the booking.

**Done when:** a booking logs an email with the reference, and a forced email error still returns 201.

#### [ ] 6.6 Build the frontend pages

- `/bookings` is the "Find bookings" page in the navbar: a lookup form for guests and a list for logged-in users.
- Add booking details and a cancel button.
- Add logging out, which deletes the `session` cookie. The server keeps no session to end.

**Done when:** a user can find, view and cancel a booking in the browser.

---

### Phase 7: Account features

#### [ ] 7.1 Build `PATCH /users/me`

- Update `fullName` and `phone` only.

**Done when:** extra fields such as `role` are ignored.

#### [ ] 7.2 Build `POST /users/me/password`

- Requires the current password, and uses the signup password rules for the new one.

**Done when:** a wrong current password returns 401.

#### [ ] 7.3 Build password reset

- Add `PasswordResetToken` with a hashed token, an expiry of 1 hour and single use.
- `forgot-password` always returns 200, so it doesn't reveal which emails exist.
- `reset-password` sets the password and uses up the token.
- Add the frontend pages.

**Done when:** a token works once, and an expired token fails.

#### [ ] 7.4 Build favourites

- Add `Favorite` with `@@id([userId, hotelId])`.
- `PUT` is safe to repeat. `DELETE` returns 204.

**Done when:** tests cover saving twice and removing.

#### [ ] 7.5 Connect the favourite button

- `FavoriteButton` currently keeps its state in the browser only, with just a `label` prop. Give it a hotel id and a server action.
- Send guests to `/login`.

**Done when:** a saved hotel stays saved after a refresh.

#### [ ] 7.6 Build reviews

- `GET` is paginated.
- `POST` needs a finished, non-cancelled stay at that hotel, with one review per booking.
- Update `rating` with `(rating * reviewCount + score) / (reviewCount + 1)`. Don't average the `Review` rows, because seeded hotels show large review counts with only 5 rows.

**Done when:** tests cover a stay that hasn't ended, a second review, and the rating update.

---

### Phase 8: Offers, rewards and payments

trip.com's offers vary by product: 10% for new users, 8% on another page, 5% capped at US$7, and codes valid 15 days after claiming. So every rule below is stored as data.

#### [ ] 8.1 Add promotions and `GET /promotions`

- `Promotion`: `code`, `title`, `terms`, `discountType` (`PERCENT` or `FIXED`), `discountValue`, `maxDiscount?`, `minSpend?`, `product`, `firstBookingOnly`, `claimValidDays?`, `startsAt`, `endsAt`, `isActive`.
- Seed the offers already shown on the home page.

**Done when:** only active offers are returned.

#### [ ] 8.2 Build claiming

- Add `UserPromotion` with `expiresAt` and `usedAt`. One claim per user.

**Done when:** a second claim returns 409, and `/users/me/promotions` lists claims.

#### [ ] 8.3 Build `POST /promotions/validate`

- Input is a code, product and amount. Output is the discount and final total, or a clear reason it can't be used.

**Done when:** tests cover min spend, the cap, expiry and first booking only.

#### [ ] 8.4 Apply promotions to bookings

- Add optional `promoCode` to both booking endpoints, and store `discount` on `Booking`.
- Recalculate the discount on the server, and mark it used inside the booking transaction.
- Give the promotion back when a booking is cancelled.

**Done when:** a simultaneous double use only succeeds once.

#### [ ] 8.5 Build rewards

- `RewardTransaction` as a ledger: `userId`, `points`, `reason`, `bookingId?`.
- The balance is the sum of the ledger. Earn on finished trips, reverse on refunds.

**Done when:** a finished trip adds points once only.

#### [ ] 8.6 Add online payments (needs your go-ahead)

Use Stripe test mode only, until you decide otherwise.

- Add `Payment`. Bookings start unpaid and become `PAID` from the webhook only, never from the browser.
- Mount `/payments/webhook` with `express.raw()` **before** `express.json()`, or the signature check fails.
- Handle repeated webhook events safely. Refund on cancellation.
- Replace the "payment is not connected" message in the booking forms.

**Done when:** a Stripe test card pays a booking, and a forged webhook is rejected.

#### [ ] 8.7 Add currencies

- `ExchangeRate` table with USD as the base. Prices stay stored in USD.
- `GET /currencies`, plus `?currency=` on search and details.
- Bookings store the charged currency and amount.
- Connect the navbar's currency link.

**Done when:** a search in another currency converts prices and a booking saves the right amount.

---

### Phase 9: Admin

#### [ ] 9.1 Create the first admin

- Add a script, `npm run admin:create`, that makes a user an admin.

**Done when:** that user passes `requireAdmin`.

#### [ ] 9.2 Manage hotels and rooms

- Validate all input, keep `Hotel.pricePerNight` equal to the lowest room price, and block deleting anything with active bookings.

**Done when:** tests cover a non-admin getting 403 and the price staying correct.

#### [ ] 9.3 Manage bookings and users

- Paginated lists with filters. Never return password hashes.

**Done when:** an admin can find a booking and cancel it.

#### [ ] 9.4 Manage content, deals and promotions

- Validate `ContentBlock` data with a Zod schema for each `key`.

**Done when:** a change to the home content appears on the home page.

#### [ ] 9.5 Build `GET /admin/stats`

- Bookings, revenue and cancellations over a date range.

**Done when:** totals match a hand-checked sample.

---

### Phase 10: Production readiness

#### [ ] 10.1 Write API docs

- Publish an OpenAPI file, served at `/api/docs` in development.

**Done when:** every endpoint is listed.

#### [ ] 10.2 Prevent double bookings

- Accept an `Idempotency-Key` header on booking endpoints, and send one from the booking forms.

**Done when:** the same key twice creates one booking.

#### [ ] 10.3 Tune performance

- Check slow queries with `EXPLAIN ANALYZE`, and add indexes as needed.
- Cache content and destinations briefly.

**Done when:** hotel and flight search stay fast with 10x the data.

#### [ ] 10.4 Add structured logs and monitoring

- Use `pino`, add request ids, and never log passwords, tokens or card details.
- Extend `/health` for uptime checks.

**Done when:** an error can be traced by request id.

#### [ ] 10.5 Add CI

- On each push, run install, migrations against a Postgres service, and tests.

**Done when:** a failing test fails the build.

#### [ ] 10.6 Deploy

- Add a production `Dockerfile`, run `prisma migrate deploy` on release, and use a managed Postgres with backups.
- Set `trust proxy` for the hosting platform, and test a restore.

**Done when:** the production API serves the production frontend.

---

### Phase 11: More travel products

Each product follows the same pattern, and builds the page and the API together:

1. Add catalogue models and seed fictional data.
2. Add search, detail and booking endpoints.
3. Add a new `Booking.type`, with its own detail table beside `HotelStay` and `FlightTrip`.
4. Build the frontend pages using the existing structure.

#### [ ] 11.1 Trains: stations, search and offers

- Search fields seen on trip.com: trains or buses, single, return or open return, from, to, date and time, passengers, railcards.
- Filters: departure time, duration, ticket flexibility, seat class.

**Done when:** `/trains` search shows results.

#### [ ] 11.2 Trains: booking

- Collect passport or national ID numbers only where a route needs them, and treat them as sensitive data.

**Done when:** a train booking appears under My Bookings.

#### [ ] 11.3 Cars: locations, search and details

- Fields seen on trip.com: pick-up and drop-off times, rental length, licence issuing country, and driver age.

**Done when:** `/cars` search shows results.

#### [ ] 11.4 Cars: booking

- Store each supplier's cancellation window and the deposit terms.

**Done when:** a car booking appears under My Bookings.

#### [ ] 11.5 Attractions: search and details

- One search box, Recommended, Attractions and Experiences tabs, cards with rating, review count and distance.

**Done when:** `/attractions` shows results.

#### [ ] 11.6 Attractions: ticket booking

- Daily ticket limits and an e-ticket voucher code in the confirmation email.

**Done when:** a booking produces a voucher.

#### [ ] 11.7 Flight + Hotel packages

- Combine a flight offer with a hotel room, under one reference, reusing the checks from tasks 5.4 and 5.6.
- If either part fails, neither is booked.

**Done when:** a sold-out room fails the whole package.

#### [ ] 11.8 Tours and cruises

- Listings and details, with an enquiry form rather than instant booking.

**Done when:** an enquiry is saved and emailed.

---

### Phase 12: Explore and support

#### [ ] 12.1 Deals page

- Combine active hotel, flight and promotion offers into one list.

**Done when:** `/deals` shows offers from each product.

#### [ ] 12.2 Travel guides

- `Guide` model with slug, city, title, body and images.

**Done when:** `/inspiration` shows guides.

#### [ ] 12.3 Map

- Add `latitude` and `longitude` to `Hotel`. `bbox` is `west,south,east,north`.

**Done when:** panning the map loads hotels in view.

#### [ ] 12.4 Trip planner

- `Trip` and `TripItem`, with items pointing at hotels, flights or attractions.

**Done when:** a user can save a plan with stops and reopen it.

#### [ ] 12.5 Customer support

- FAQ list and `SupportTicket` linked to an optional booking.

**Done when:** a ticket can be submitted and shows under the user's account.

#### [ ] 12.6 List your property

- `PropertyApplication` from a public form, with a rate limit and an admin list.

**Done when:** an application shows up for admins.
