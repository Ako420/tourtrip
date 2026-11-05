# Hotel Jr backend TODO

The full plan for the Hotel Jr backend: everything needed to run a travel site like https://www.trip.com/, split into small tasks so we can do one at a time.

**How to use this file**

1. Take the first unchecked task in section 6. Tasks are in dependency order.
2. Build only that task. Check its "Done when" line, then tick its box.
3. Stop and review before starting the next one.

**Next task: 2.2**

**Stack**

| Job | Tool |
| --- | --- |
| API | Node 24, Express 5, ES modules |
| Database | PostgreSQL 18, Prisma 7 with `@prisma/adapter-pg` |
| Validation | Zod |
| Login tokens | JWT with `jsonwebtoken` |
| Password hashing | bcrypt |
| File storage | Cloudinary, with `multer` to receive uploads |
| Frontend connection | axios |

**Where the plan comes from**

- **The frontend in `frontend/src`.** Its services, types and Zod schemas already define the API it expects, so those shapes are the contract. Phases 1 to 11 build exactly that.
- **The reference site.** Everything else comes from trip.com's product pages, read on 2026-11-04. We take the feature ideas and rules only, and keep Hotel Jr's own branding, copy and data.

| trip.com page | Status |
| --- | --- |
| Home, hotels, trains, cars, deals, cruises, airport transfers, support | Read |
| Attractions, rewards | Read in part |
| Flights, Flight + Hotel | Not read. Both redirect to a verification check, which we don't bypass |
| Tours | Not read. The page returned status 432 |
| Travel guides | Not read. The page returned 404 |

Where a page wasn't read, the plan is our own design. Flight basics come from the frontend. The flight extras in phase 20 come from search results about trip.com, which are mostly its own marketing pages.

---

## 1. Where we are today

| Area | Status |
| --- | --- |
| Layers | `routers` → `controllers` → `services`, plus `middlewares`, `config` and `utils` |
| Working endpoints | `GET /`, `GET /api/health`, `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, and `/api/rooms`, which task 4.1 removes |
| Database | `hotel_jr` and `hotel_jr_test` each have a `User` table and an empty `Room` table |
| Done | Phases 0 and 1, and task 2.1: project setup, tests, accounts, axios |
| Missing | Seed data, and every travel endpoint the frontend calls |

**Problems to fix along the way**

- `Room` doesn't match the frontend. It's a physical room with a `number` and no hotel, while the frontend needs room types that belong to a hotel. The frontend never calls `/api/rooms`, so task 4.1 replaces both.
- The frontend's `http.ts` doesn't send the session token yet (task 2.2).
- `GET /hotels/:slug` is called without dates, so room availability can't reflect the guest's stay yet (task 10.5).
- Setting `API_URL` in the frontend switches **every** service to the API at once. Until phases 1 to 10 exist, pages would fail, so that switch waits for task 10.12. Test earlier tasks with automated tests or `curl`.
- Many sidebar and footer links have no page yet: packages, tours, cruises, deals, rewards, support and more. Their API and pages get built together in phases 11 to 21.

---

## 2. Decisions

These are the defaults this plan uses. Tell me before the related task if you want any of them changed.

| # | Decision | Why |
| --- | --- | --- |
| 1 | JavaScript with ES modules, no TypeScript | Matches the current backend |
| 2 | Keep `router → controller → service`, and add validators and mappers | Extends the current layout without a rewrite |
| 3 | Zod for validation | The frontend already uses it, so the rules can match |
| 4 | String `cuid()` ids on new tables | Frontend types use `id: string` |
| 5 | JWT Bearer token, 7 day expiry | Your choice. The frontend stores `{ token }` in a 7 day `session` cookie |
| 6 | bcrypt for passwords, cost 12 | Your choice. The frontend already caps passwords at 72 characters, which is bcrypt's limit |
| 7 | Cloudinary holds every image, and the database keeps its URL | Your choice. The frontend already reads plain image URLs, so its components don't change |
| 8 | axios runs on the Next.js server only | Your choice of library. All API calls already run on the server, which keeps `API_URL` private and the `session` cookie out of browser code. It also means CORS isn't needed |
| 9 | All travel inventory is our own fictional data | The sample airlines and hotels are fictional. Real fares need paid providers such as Amadeus or Duffel |
| 10 | No online payment until phase 15 | The booking forms say payment isn't connected, and hotel policy says cards are accepted at the property |
| 11 | Guests can book without an account | The booking forms don't need a login, and trip.com also finds bookings by email |
| 12 | Prices are always recalculated on the server | A client-sent `total` is only ever compared, never trusted |
| 13 | USD only until task 15.5 | All sample data is USD |
| 14 | trip.com's rewards numbers are starting values in database tables | Rules can change without code. Hotel Jr uses its own name, "Jr Coins" |

---

## 3. Architecture and conventions

### Folder layout

```text
backend/
  prisma/
    schema.prisma
    migrations/
    seed.js
    seed-images.js        Moves sample images to Cloudinary
    seed-data/            JSON exported from the frontend sample data
  src/
    app.js                Express app, middleware and routes
    server.js             Starts the server
    config/               db.js, env.js, cloudinary.js
    routers/              <name>.router.js, one per resource, joined in index.js
    controllers/          <name>.controller.js, read the request and send the response
    services/             <name>.service.js, business rules and Prisma queries
    validators/           <name>.validator.js, Zod schemas
    mappers/              <name>.mapper.js, database row → API shape
    middlewares/          errorHandler, notFound, validate, auth, rateLimit, upload
    jobs/                 Scheduled work, such as coin expiry
    utils/                httpError.js, dates.js, money.js, pagination.js, reference.js, token.js
  tests/                  <name>.test.js
```

### Request flow

```text
Browser → Next.js server → axios → router → validate(schema) → requireAuth (when needed)
                                                                      ↓
                 response ← controller ← mapper ← service ← Prisma ← controller
```

- **Router:** paths and middleware only.
- **Controller:** reads `req.validated`, calls one service, sends the response. No Prisma here.
- **Service:** rules and queries. It throws `HttpError` and knows nothing about `req` or `res`.
- **Mapper:** turns rows into the exact shape in `frontend/src/types`.

### Rules that apply to every task

- **Express 5 catches async errors**, so controllers don't need `try/catch`. This is already how the current code works.
- **Don't assign to `req.query`.** It's read-only in Express 5. The `validate` middleware stores parsed values on `req.validated`.
- **Register fixed paths before parameters.** `/hotels/search` must come before `/hotels/:slug`, `/attractions/search` before `/attractions/:slug`, and `/flights/search` before anything with `:id`.
- **Query booleans:** use `queryBoolean` from `utils/validators.js`. `z.coerce.boolean()` turns the text `"false"` into `true`.
- **Query lists:** use `commaList()` for hotel `stars` and `amenities`, and `pipeList()` for every flight, train and car list, such as `airlines`, `operators` and `supplier`, because the frontend's query builders do this. Pass a schema for items that aren't text, such as `commaList(z.coerce.number().int())`.
- **Money:** `Decimal(10, 2)` columns. Do price sums with Prisma's `Decimal`, not JS floats. Prices may reach the frontend as strings, which it accepts.
- **Ratings:** `Float` columns. The frontend compares `rating` as a number and calls `toFixed` on it, so it must not be a Decimal string. Hotels and car suppliers are rated out of 10, and attractions out of 5.
- **Dates:** stay and flight dates are `@db.Date` and go over the API as `YYYY-MM-DD`. Timestamps are ISO 8601.
- **Trusted data:** prices, room details and availability always come from the database, never from the request.
- **Images:** the database stores Cloudinary URLs. Secrets stay on the backend, and uploads go through the API.
- **Logs:** `morgan` writes every URL to the log, so personal details and tokens never go in a query string.
- **Tests:** files run one at a time, because they share the test database.
- **Migrations:** after `prisma migrate dev`, run `npm run db:generate` to update the Prisma client, and `npm run test:db` so tests get the new tables.
- **Every request comes from the Next.js server**, so all requests share one IP. Rate limits on sensitive routes must key on something else, such as the email address.

### Responses

Success responses match the frontend types directly, with no `{ data: ... }` wrapper.

Errors keep the `message` field and add a `code`:

```json
{
  "message": "This room has just sold out.",
  "code": "ROOM_SOLD_OUT",
  "errors": [{ "path": "checkIn", "message": "Enter a valid date" }]
}
```

`errors` only appears on validation failures.

Shared codes set by the error middleware: `VALIDATION_ERROR`, `ALREADY_EXISTS`, `NOT_FOUND`, `ROUTE_NOT_FOUND`, `REQUEST_ERROR`, `INTERNAL_ERROR`. Services choose their own code when they throw `HttpError`. A 5xx `HttpError` is logged, and clients only see the generic message.

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
| 413 | Upload too large |
| 429 | Too many attempts |
| 500 | Unexpected error, details logged and never sent |

---

## 4. Database design

Models are grouped by the phase that adds them. Every table also has `createdAt`, and those that change have `updatedAt`.

### Phase 1: accounts

**User:** `id`, `fullName`, `email` (unique, lowercase), `passwordHash`, `phone?`, `avatarUrl?`, `role` (`USER` or `ADMIN`), `emailVerifiedAt?`

### Phase 3: files

**Asset:** `id`, `publicId` (unique), `url`, `folder`, `width`, `height`, `format`, `bytes`, `uploadedById?`

Other tables keep plain URLs, which match the frontend types. `Asset` records what's in Cloudinary, so files can be found and deleted.

### Phase 4: hotels

**Hotel:** `id`, `slug` (unique), `name`, `area`, `city`, `country`, `address`, `description`, `imageUrl`, `images String[]`, `highlights String[]`, `stars Int`, `rating Float`, `reviewCount Int`, `pricePerNight Decimal` (lowest room price), `originalPrice Decimal?`, `currency`, `freeCancellation`, `breakfastIncluded`, `sortRank Int`, `reviewScores Json`, `policies Json`, `nearby Json`

Indexes: `city`, `pricePerNight`, `rating`.

`reviewScores`, `policies` and `nearby` are `Json` because they're only displayed and never filtered on.

**Amenity:** `id` (text such as `wifi`), `label`, `iconName`. Many-to-many with Hotel.

**RoomType** (replaces `Room`): `id`, `hotelId`, `name`, `beds`, `maxGuests`, `pricePerNight`, `isAvailable`, `imageUrl`, `sizeSqm`, `freeCancellation`, `breakfastIncluded`, `totalRooms`

**Review:** `id`, `hotelId`, `userId?`, `bookingId?` (unique), `author`, `country`, `score Float`, `stayDate` (text such as `October 2026`), `title`, `text`, `photos String[]`

### Phase 5: page content

**ContentBlock:** `key` (unique, such as `home`, `flights`, `cars`, `legal-terms`), `data Json`

### Phase 6: flights

**Airport:** `id`, `code` (unique), `city` (unique), `country`

**Airline:** `id`, `code` (unique), `name`

**FlightSchedule:** `id`, `airlineId`, `flightNumber`, `aircraft`, `fromAirportId`, `toAirportId`, `departMinutes`, `durationMinutes`, `stops`, `stopCity?`, `baseFare Decimal`, `checkedBag`, `refundable`, `seatsPerCabin`, `returnScheduleId?`

Index: `(fromAirportId, toAirportId)`.

**FlightDeparture:** `id`, `scheduleId`, `date @db.Date`, `cabin`, `seatsBooked`. Unique on `(scheduleId, date, cabin)`. A row is created the first time a seat is sold, so seats left is `seatsPerCabin - seatsBooked`.

**FlightDeal:** `id`, `airlineId`, `fromCity`, `toCity`, `departDate`, `returnDate`, `cabin`, `isNonstop`, `price`, `currency`, `isActive`

### Phase 7: attractions

**Attraction:** `id`, `slug` (unique), `name`, `city`, `country`, `category` (`landmarks`, `nature`, `adventure` or `city`), `imageUrl`, `rating Float`, `reviewCount Int`, `duration` (text such as `2 hours`), `price Decimal` (lowest adult ticket price), `currency`, `freeCancellation`, `sortRank Int`, `description`, `highlights String[]`, `address`, `reviewScores Json`, `policies Json`, `nearby Json`

Indexes: `city`, `category`, `rating`.

**TicketOption:** `id`, `attractionId`, `name`, `description`, `includes String[]`, `adultPrice Decimal`, `childPrice Decimal`, `dailyLimit Int`. Unique on `(attractionId, name)`.

**Review** gains `attractionId?`, and its `hotelId` becomes optional. Each review belongs to one hotel or one attraction, and the service checks this.

### Phase 8: trains

**Station:** `id`, `name` (unique)

**TrainOperator:** `id`, `code` (unique), `name`

**TrainSchedule:** `id`, `operatorId`, `trainNumber`, `fromStationId`, `toStationId`, `departMinutes`, `durationMinutes`, `changes`, `changeCity?`, `baseFare Decimal`, `refundable`, `seatsPerClass`, `returnScheduleId?`

Index: `(fromStationId, toStationId)`.

**TrainDeparture:** `id`, `scheduleId`, `date @db.Date`, `seatClass`, `seatsBooked`. Unique on `(scheduleId, date, seatClass)`. It works like `FlightDeparture`.

### Phase 9: cars

**CarLocation:** `id`, `name` (unique), `priceFactor Decimal`

**CarSupplier:** `id`, `name` (unique), `rating Float`, `priceFactor Decimal`

**CarClass:** `id` (text such as `economy`), `label`, `name`, `imageUrl`, `seats`, `bags`, `dayPrice Decimal`, `sortRank`

**CarOffer:** `id`, `supplierId`, `carClassId`, `transmission`, `hasUnlimitedMileage`, `freeCancellation`, `fleetSize`. Unique on `(supplierId, carClassId)`.

### Phase 10: bookings

**Booking:** `id`, `reference` (unique), `userId?`, `type`, `status` (`CONFIRMED` or `CANCELLED`), `paymentStatus` (`UNPAID`, `PAID` or `REFUNDED`), `email` (lowercase), `phone`, `total Decimal`, `currency`, `cancelledAt?`, `completedAt?`

`type` starts as `HOTEL`, `FLIGHT`, `ATTRACTION`, `TRAIN` or `CAR`, and later phases add `TRANSFER` and `PACKAGE`. Each type has its own detail table.

Indexes: `userId`, `email`.

**HotelStay:** `bookingId` (unique), `hotelId`, `roomTypeId`, `checkIn @db.Date`, `checkOut @db.Date`, `rooms`, `adults`, `children`, `firstName`, `lastName`, `arrivalTime?`, `specialRequests?`, `pricePerNight` (copy at booking time), `freeCancellation` (copy at booking time)

Index: `(roomTypeId, checkIn, checkOut)`.

**FlightTrip:** `bookingId` (unique), `offerId`, `outboundScheduleId`, `inboundScheduleId?`, `tripType`, `fromCity`, `toCity`, `departDate`, `returnDate?`, `adults`, `children`, `cabin`, `refundable` (copy at booking time)

**Passenger:** `id`, `bookingId`, `type` (`ADULT` or `CHILD`), `firstName`, `lastName`, `birthDate @db.Date`, `idNumber?`. Flights use this table, and so can rail tickets that need ID numbers later.

**TicketBooking:** `bookingId` (unique), `attractionId`, `ticketOptionId`, `visitDate @db.Date`, `adults`, `children`, `firstName`, `lastName`, `voucherCode` (unique), `adultPrice`, `childPrice` and `freeCancellation` (copies at booking time)

Index: `(ticketOptionId, visitDate)`.

**TrainTrip:** `bookingId` (unique), `offerId`, `outboundScheduleId`, `inboundScheduleId?`, `tripType`, `fromStation`, `toStation`, `departDate`, `returnDate?`, `adults`, `children`, `seatClass`, `firstName`, `lastName`, `refundable` (copy at booking time)

**CarRental:** `bookingId` (unique), `carOfferId`, `location`, `dropoffLocation?`, `pickupAt`, `dropoffAt`, `days`, `isStandardAge`, `firstName`, `lastName`, `birthDate @db.Date`, `pricePerDay` and `freeCancellation` (copies at booking time)

Index: `(carOfferId, pickupAt, dropoffAt)`.

The copied fields keep old bookings correct when prices or policies change later.

### Later phases

| Phase | Models |
| --- | --- |
| 12 | `PasswordResetToken`, `EmailVerificationToken`, `Favorite` |
| 13 | `Promotion`, `UserPromotion`, `Campaign` |
| 14 | `RewardTier`, `EarnRate`, `TierPerk`, `Membership`, `CoinTransaction` |
| 15 | `Payment`, `ExchangeRate` |
| 16 | `TransferVehicle`, `TransferRate`, `TransferRide`, `Railcard`, `RailPass`, `RailPassOrder` |
| 17 | `PackageBooking`, which links a flight and a hotel booking under one reference |
| 18 | `Tour`, `TourDeparture`, `Cruise`, `CruiseSailing`, `Enquiry` |
| 19 | `Guide`, `Moment`, `Trip`, `TripItem` |
| 20 | `PriceAlert`, `FlightExtra` |
| 21 | `Faq`, `SupportTicket`, `SupportMessage`, `PropertyApplication`, `PartnerApplication` |

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
| PATCH | `/users/me` | user | 12.1 | Update name and phone |
| POST | `/users/me/avatar` | user | 12.2 | Upload a profile photo |
| DELETE | `/users/me/avatar` | user | 12.2 | Remove the profile photo |
| POST | `/users/me/password` | user | 12.3 | Change password |
| POST | `/auth/forgot-password` | none | 12.4 | Email a reset link |
| POST | `/auth/reset-password` | none | 12.4 | Set a new password with the link's token |
| POST | `/auth/send-verification` | user | 12.5 | Email a verification link |
| POST | `/auth/verify-email` | none | 12.5 | Confirm an email address |

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

The JWT payload is `{ sub: user.id, role: user.role }`. Protected routes read `Authorization: Bearer <token>`.

### 5.3 Files

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/admin/uploads` | admin | 3.4 | Upload an image to a chosen folder |
| GET | `/admin/uploads` | admin | 3.4 | List uploaded images, `?folder=`, `?page=` |
| DELETE | `/admin/uploads/:id` | admin | 3.4 | Delete an image |

`POST /admin/uploads` takes `multipart/form-data` with `file` and `folder`. It returns:

```json
{
  "id": "…", "publicId": "hotel-jr/hotels/abc123",
  "url": "https://res.cloudinary.com/<cloud>/image/upload/v1/hotel-jr/hotels/abc123.jpg",
  "width": 2000, "height": 1333, "format": "jpg", "bytes": 482113
}
```

### 5.4 Hotels

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/destinations` | none | 4.4 | City names for the search box |
| GET | `/hotels` | none | 4.4 | Plain hotel list for the home page |
| GET | `/hotels/search` | none | 4.5, 4.6 | Search, filter, sort, paginate |
| GET | `/hotels/:slug` | none | 4.7 | Full hotel details |
| GET | `/hotels/:slug/similar` | none | 4.8 | Six hotels nearest in price |
| GET | `/hotels/:slug/reviews` | none | 12.8 | Paginated reviews |
| POST | `/hotels/:slug/reviews` | user | 12.8 | Review a finished stay |
| POST | `/hotels/:slug/reviews/:id/photos` | user | 12.9 | Add photos to your review |

`GET /destinations` returns `string[]`.

`GET /hotels` takes optional `destination` and returns `HotelSummary[]`.

`GET /hotels/search` query:

| Param | Type | Notes |
| --- | --- | --- |
| `destination` | text | Case-insensitive match on name, city or country |
| `checkIn`, `checkOut` | `YYYY-MM-DD` | Used for availability from task 10.5 |
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

`GET /hotels/:slug` returns `HotelSummary` plus `address`, `description`, `images`, `highlights`, `rooms`, `reviewScores`, `reviews` (latest 5), `policies` and `nearby`. It returns 404 for an unknown slug. From task 10.5 it also accepts optional `checkIn` and `checkOut`.

### 5.5 Page content

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/home` | none | 5.2 | `HomeContent` for the home page |
| GET | `/flights/content` | none | 5.2 | `FlightsContent` for the flights page |
| GET | `/attractions/content` | none | 5.2 | `AttractionsContent` for the attractions page |
| GET | `/cars/content` | none | 5.2 | `CarsContent` for the cars page |
| GET | `/trains/content` | none | 5.2 | `TrainsContent` for the trains page |
| GET | `/planner/content` | none | 5.2 | Content for the planner page |
| GET | `/legal/:slug` | none | 5.2 | `LegalDocument` for `terms` or `privacy` |
| GET | `/pages/:slug` | none | 21.6 | About, news and other info pages |

### 5.6 Flights

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/airports` | none | 6.5 | City names for the search box |
| GET | `/flights/deals` | none | 6.5 | Deals, filtered by `from`, `to`, `nonstop` |
| GET | `/flights/search` | none | 6.6 to 6.8 | Search, filter, sort, paginate |
| GET | `/flights/offers/:id` | none | 6.9 | One offer, using the same search params |
| GET | `/flights/price-trend` | none | 20.2 | Lowest fare by day for a route |
| GET | `/flights/status` | none | 20.3 | Status by flight number and date |
| GET | `/flights/offers/:id/extras` | none | 20.4 | Bags and seat options |
| GET, POST | `/price-alerts` | user | 20.2 | List or create fare alerts |
| DELETE | `/price-alerts/:id` | user | 20.2 | Remove a fare alert |

`GET /flights/search` query:

| Param | Type | Notes |
| --- | --- | --- |
| `from`, `to` | text | City names |
| `tripType` | text | `round-trip` or `one-way`. `multi-city` from task 20.1 |
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

### 5.7 Attractions

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/attractions/search` | none | 7.4 | Search, filter, sort, paginate |
| GET | `/attractions/:slug` | none | 7.5 | Full attraction details |
| GET | `/attractions/:slug/similar` | none | 7.6 | Up to six others, same category first |
| GET | `/planner/suggestions` | none | 7.7 | Attractions to add to a trip plan |

`GET /attractions/search` query:

| Param | Type | Notes |
| --- | --- | --- |
| `q` | text | Case-insensitive match on name, city or country |
| `category` | text | `landmarks`, `nature`, `adventure`, `city`. Left out for all |
| `freeCancellation` | `true` | Sent only when on |
| `sort` | text | `recommended` (default), `rating`, `price-asc` |
| `page` | number | Default 1, page size 8 |

Response:

```json
{ "items": [], "total": 16, "page": 1, "pageCount": 2 }
```

`Attraction`, used for `items` and `similar`:

```json
{
  "id": "…", "slug": "colosseum", "name": "The Colosseum",
  "city": "Rome", "country": "Italy", "category": "landmarks", "imageUrl": "…",
  "rating": 4.8, "reviewCount": 3685, "duration": "2 hours",
  "price": "32.00", "currency": "USD", "freeCancellation": true
}
```

`GET /attractions/:slug` returns `Attraction` plus `description`, `highlights`, `address`, `tickets`, `reviewScores`, `reviews` (latest 5), `policies` and `nearby`. It returns 404 for an unknown slug.

`TicketOption`:

```json
{
  "id": "…", "name": "Standard ticket", "description": "Entry for your chosen date.",
  "includes": ["Entry ticket", "Mobile ticket"], "adultPrice": "32.00", "childPrice": "19.00"
}
```

### 5.8 Bookings

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/bookings` | optional | 10.4 | Book a hotel stay |
| POST | `/flights/bookings` | optional | 10.6 | Book a flight |
| POST | `/attractions/bookings` | optional | 10.7 | Book attraction tickets |
| POST | `/trains/bookings` | optional | 10.8 | Book a train |
| POST | `/cars/bookings` | optional | 10.9 | Book a car |
| GET | `/bookings` | user | 11.1 | My bookings, `?page`, `?status` |
| GET | `/bookings/:reference` | user | 11.2 | One of my bookings |
| POST | `/bookings/lookup` | none | 10.10 | Find a booking by reference and email |
| POST | `/bookings/:reference/cancel` | optional | 11.3 | Cancel a booking |

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

`POST /attractions/bookings`

```json
// Body
{
  "slug": "colosseum", "ticketId": "…", "date": "2026-12-10", "adults": 2, "children": 1,
  "firstName": "Ada", "lastName": "Obi", "email": "ada@example.com", "phone": "+234 800 000 0000",
  "total": 83, "currency": "USD"
}
// 201
{ "reference": "HJ-7K2M9QXA" }
```

`POST /trains/bookings`

```json
// Body
{
  "offerId": "…", "from": "London", "to": "Paris", "tripType": "round-trip",
  "departDate": "2026-12-10", "returnDate": "2026-12-20",
  "adults": 2, "children": 0, "seatClass": "Standard",
  "firstName": "Ada", "lastName": "Obi", "email": "ada@example.com", "phone": "+234 800 000 0000",
  "total": 212, "currency": "USD"
}
// 201
{ "reference": "HJ-7K2M9QXA" }
```

`POST /cars/bookings`

```json
// Body
{
  "offerId": "…", "location": "Lagos", "dropoffLocation": "Accra",
  "pickupDate": "2026-12-10", "pickupTime": "10:00", "dropoffDate": "2026-12-13", "dropoffTime": "10:00",
  "isStandardAge": true,
  "firstName": "Ada", "lastName": "Obi", "birthDate": "1990-04-02",
  "email": "ada@example.com", "phone": "+234 800 000 0000",
  "total": 144, "currency": "USD"
}
// 201
{ "reference": "HJ-7K2M9QXA" }
```

`dropoffLocation` is left out when the car returns to the pick-up place.

`POST /bookings/lookup` takes `{ reference, email }` and returns `BookingRecord`:

```json
{
  "reference": "HJ-7K2M9QXA", "type": "hotel",
  "title": "Azure Cliff Resort", "subtitle": "Garden Room, Bali",
  "startDate": "2026-12-10", "endDate": "2026-12-13", "guests": "2 adults",
  "status": "confirmed", "total": "567.00", "currency": "USD",
  "imageUrl": "…", "href": "/hotels/azure-cliff-resort"
}
```

- `type` is `hotel`, `flight`, `attraction`, `car` or `train`.
- `status` is `confirmed`, `completed` or `cancelled`. A booking shows as `completed` once its dates have passed.
- A wrong reference and a wrong email both return the same 404.
- `GET /bookings` and `GET /bookings/:reference` use this shape too, and add `canCancel`.

Booking error codes, all status 409: `ROOM_SOLD_OUT`, `SEATS_UNAVAILABLE`, `TICKETS_UNAVAILABLE`, `CARS_UNAVAILABLE`, `PRICE_CHANGED`, `NOT_CANCELLABLE`.

### 5.9 Favourites, deals and promotions

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/favorites` | user | 12.6 | My saved hotels |
| PUT | `/favorites/:hotelId` | user | 12.6 | Save a hotel |
| DELETE | `/favorites/:hotelId` | user | 12.6 | Remove a saved hotel |
| GET | `/promotions` | none | 13.1 | Active offers, `?product=` |
| POST | `/promotions/:id/claim` | user | 13.2 | Claim an offer |
| GET | `/users/me/promotions` | user | 13.2 | My claimed offers |
| POST | `/promotions/validate` | optional | 13.3 | Preview a code's discount |
| GET | `/deals` | none | 13.5 | Sale campaigns and hot deals |
| GET | `/deals/:slug` | none | 13.5 | One sale campaign |

### 5.10 Rewards

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/rewards/tiers` | none | 14.9 | Tiers, rules and perks |
| GET | `/rewards` | user | 14.9 | My tier, progress and coin balance |
| GET | `/rewards/coins` | user | 14.9 | My coin history, `?page=` |

Booking endpoints gain an optional `coins` field in task 14.6.

### 5.11 Payments and currency

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/payments/intents` | optional | 15.1 | Start paying for a booking |
| POST | `/payments/webhook` | signed | 15.2 | Payment provider updates |
| GET | `/currencies` | none | 15.5 | Supported currencies and rates |

### 5.12 Trains

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/trains/stations` | none | 8.5 | Station names as `string[]` |
| GET | `/trains/search` | none | 8.6 to 8.8 | Search, filter, sort, paginate |
| GET | `/trains/offers/:id` | none | 8.9 | One offer, using the same search params |
| GET | `/trains/passes` | none | 16.7 | Rail passes |
| POST | `/trains/passes/:id/orders` | optional | 16.7 | Buy a rail pass |
| GET | `/trains/railcards` | none | 16.8 | Railcards and loyalty cards |

`GET /trains/search` query:

| Param | Type | Notes |
| --- | --- | --- |
| `from`, `to` | text | Station names |
| `tripType` | text | `round-trip` or `one-way` |
| `departDate`, `returnDate` | `YYYY-MM-DD` | `returnDate` for round trips |
| `adults`, `children` | number | 1-9, 0-8 |
| `seatClass` | text | `Standard` or `First` |
| `changes` | list | Separated by `\|`, `2` means 2 or more |
| `operators` | list | Separated by `\|` |
| `departure` | list | Same values as flights, separated by `\|` |
| `refundable` | `true` | Sent only when on |
| `sort` | text | `best` (default), `cheapest`, `fastest`, `earliest` |
| `page` | number | Default 1, page size 6 |

Response:

```json
{
  "items": [],
  "total": 12, "page": 1, "pageCount": 2, "currency": "USD",
  "operators": [{ "name": "Meridian Rail", "lowestPrice": 58 }],
  "fareCalendar": [{ "date": "2026-12-07", "lowestPrice": 52 }],
  "sortSummary": { "best": "$64", "cheapest": "$58", "fastest": "2h 20m" }
}
```

`TrainOffer`, used for `items`:

```json
{
  "id": "…", "operator": "Meridian Rail", "trainNumber": "MR 214",
  "outbound": { "from": "London", "to": "Paris", "date": "2026-12-10", "departMinutes": 545, "durationMinutes": 140, "stops": 0 },
  "seatClass": "Standard", "refundable": true, "seatsLeft": 4,
  "pricePerAdult": 58, "totalPrice": 116, "currency": "USD"
}
```

`inbound` has the same shape, and only appears on round trips. `stops` holds the number of changes, and `stopCity` the place, because the frontend reuses `FlightLeg`.

### 5.13 Cars and airport transfers

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/cars/locations` | none | 9.5 | Pick-up and drop-off places as `string[]` |
| GET | `/cars/search` | none | 9.6 | Search, filter, sort, paginate |
| GET | `/cars/offers/:id` | none | 9.7 | One offer, using the same search params |
| GET | `/transfers/search` | none | 16.2 | Vehicles and prices for a route |
| POST | `/transfers/bookings` | optional | 16.3 | Book an airport transfer |

`GET /cars/search` query:

| Param | Type | Notes |
| --- | --- | --- |
| `location` | text | Pick-up place |
| `dropoffLocation` | text | Sent only for a different drop-off place |
| `pickupDate`, `dropoffDate` | `YYYY-MM-DD` | |
| `pickupTime`, `dropoffTime` | `HH:mm` | 06:00 to 22:00, in half hours |
| `standardAge` | `false` | Sent only when the driver is outside ages 25 to 69 |
| `type` | list | `economy`, `compact`, `sedan`, `suv`, `van`, `luxury`, separated by `\|` |
| `transmission` | list | `Automatic`, `Manual`, separated by `\|` |
| `supplier` | list | Separated by `\|` |
| `freeCancellation` | `true` | Sent only when on |
| `sort` | text | `recommended` (default), `cheapest`, `rating` |
| `page` | number | Default 1, page size 6 |

Response:

```json
{ "items": [], "total": 18, "page": 1, "pageCount": 3, "days": 3, "suppliers": ["Roadway Rentals"] }
```

`suppliers` lists every supplier before filters. `days` counts each started 24 hours, with a minimum of 1 and a maximum of 30.

`CarOffer`, used for `items`:

```json
{
  "id": "…", "name": "Fiat 500 or similar", "category": "economy", "categoryLabel": "Economy",
  "imageUrl": "…", "supplier": "Roadway Rentals", "supplierRating": 8.8,
  "seats": 4, "bags": 1, "transmission": "Automatic",
  "hasUnlimitedMileage": true, "freeCancellation": true,
  "pricePerDay": 24, "totalPrice": 72, "currency": "USD"
}
```

`GET /transfers/search` query: `direction` (`from-airport` or `to-airport`), `airport`, `address`, `pickupAt`, `passengers`, `bags`, `childSeats`, `flightNumber`.

### 5.14 Packages, tours and cruises

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/packages/search` | none | 17.1 | Flight + Hotel offers |
| POST | `/packages/bookings` | optional | 17.2 | Book a package |
| GET | `/tours` | none | 18.2 | Private and group tours, `?type=`, `?q=` |
| GET | `/tours/:slug` | none | 18.2 | Tour details and departures |
| GET | `/cruises` | none | 18.4 | Search by destination or cruise, and date |
| GET | `/cruises/:slug` | none | 18.4 | Cruise details and sailings |
| POST | `/enquiries` | optional | 18.5 | Ask about a tour or cruise |

### 5.15 Explore

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/guides` | none | 19.1 | Travel guides, `?city=`, `?page=` |
| GET | `/guides/:slug` | none | 19.1 | One guide |
| GET | `/moments` | none | 19.2 | Traveller posts, `?city=`, `?page=` |
| POST | `/moments` | user | 19.2 | Create a post with photos |
| DELETE | `/moments/:id` | user | 19.2 | Delete your post |
| GET | `/map/places` | none | 19.3 | Hotels and attractions in a map area, `?bbox=` |
| GET, POST | `/trips` | user | 19.4 | Trip planner list and create |
| GET, PATCH, DELETE | `/trips/:id` | user | 19.4 | One saved plan |
| POST | `/trips/:id/items` | user | 19.4 | Add a stop to a plan |
| DELETE | `/trips/:id/items/:itemId` | user | 19.4 | Remove a stop |

### 5.16 Support and partners

| Method | Path | Auth | Task | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/support/faqs` | none | 21.1 | Help articles, `?q=`, `?product=` |
| POST | `/support/tickets` | optional | 21.2 | Contact support |
| POST | `/assistant/chat` | user | 21.7 | Chat with the travel assistant |
| GET | `/support/tickets` | user | 21.2 | My support requests |
| GET | `/support/tickets/:id` | user | 21.2 | One request and its messages |
| POST | `/support/tickets/:id/messages` | user | 21.2 | Reply to a request |
| POST | `/support/tickets/:id/attachments` | user | 21.3 | Add an image |
| POST | `/property-applications` | none | 21.4 | "List your property" form |
| POST | `/partner-applications` | none | 21.5 | Supplier and affiliate forms |

### 5.17 Admin

All need the admin role.

| Method | Path | Task | Purpose |
| --- | --- | --- | --- |
| POST, PATCH, DELETE | `/admin/hotels`, `/admin/hotels/:id` | 22.2 | Manage hotels |
| POST, PATCH, DELETE | `/admin/hotels/:id/rooms`, `/admin/rooms/:id` | 22.2 | Manage room types |
| POST, PATCH, DELETE | `/admin/flights/deals`, `/admin/flights/deals/:id` | 22.3 | Manage flight deals |
| POST, PATCH, DELETE | `/admin/attractions`, `/admin/attractions/:id` | 22.3 | Manage attractions and tickets |
| POST, PATCH, DELETE | `/admin/products/:type`, `/admin/products/:type/:id` | 22.4 | Manage trains, cars, tours and cruises |
| GET, PATCH | `/admin/bookings`, `/admin/bookings/:reference` | 22.5 | View and update bookings |
| GET, PATCH | `/admin/users`, `/admin/users/:id` | 22.5 | List users, change roles, invite to a tier |
| PUT | `/admin/content/:key` | 22.6 | Edit page content |
| POST, PATCH, DELETE | `/admin/promotions`, `/admin/promotions/:id` | 22.6 | Manage offers |
| POST, PATCH, DELETE | `/admin/campaigns`, `/admin/campaigns/:id` | 22.6 | Manage sale campaigns |
| GET, PATCH | `/admin/support/tickets`, `/admin/applications` | 22.6 | Handle support and partner requests |
| GET | `/admin/stats` | 22.7 | Bookings and revenue summary |

---

## 6. Tasks

| Phase | Tasks | Builds |
| --- | --- | --- |
| 0 | 6 | Foundation |
| 1 | 4 | Accounts with JWT and bcrypt |
| 2 | 2 | axios connection in the frontend |
| 3 | 6 | Cloudinary file storage |
| 4 | 8 | Hotels |
| 5 | 2 | Page content |
| 6 | 9 | Flights |
| 7 | 7 | Attractions |
| 8 | 9 | Trains |
| 9 | 7 | Cars |
| 10 | 12 | Bookings, ending with the frontend fully on the API |
| 11 | 5 | Managing bookings |
| 12 | 10 | Profile, favourites, reviews |
| 13 | 6 | Promotions and deals |
| 14 | 10 | Rewards |
| 15 | 6 | Payments and currency |
| 16 | 9 | Airport transfers, plus train and car extras |
| 17 | 4 | Flight + Hotel |
| 18 | 6 | Tours and cruises |
| 19 | 5 | Guides, Moments, map, saved plans |
| 20 | 4 | Flight extras |
| 21 | 6 | Support, partners, info pages |
| 22 | 8 | Admin |
| 23 | 6 | Production |

---

### Phase 0: Foundation

#### [x] 0.1 Put the project in git

- Run `git init` in `hotel-Jr`, and add a root `.gitignore` covering `node_modules`, `.env` and `.env.*` with an exception for `.env.example`.
- Make a first commit of the current state.

**Done when:** `git status` is clean and `git ls-files | grep '\.env$'` prints nothing.

#### [x] 0.2 Validate environment variables

**Files:** `src/config/env.js`, `.env.example`, `.env`, `src/config/db.js`, `src/server.js`

- Install `zod`.
- Parse `PORT`, `DATABASE_URL`, `JWT_SECRET` (32+ characters), `JWT_EXPIRES_IN` (default `7d`) and `NODE_ENV`. Exit with a clear message if any are wrong.
- Use `env` instead of `process.env` elsewhere.
- Update `.env.example`. It currently names a `hotel_jr` database user that doesn't exist, so change it to `postgres`.
- Generate a secret with `openssl rand -hex 32`.

**Done when:** removing `JWT_SECRET` stops the server with a message naming the variable.

#### [x] 0.3 Add an `HttpError` and improve the error handler

**Files:** `src/utils/httpError.js`, `src/middlewares/errorHandler.js`

- `new HttpError(status, message, code)`.
- The handler returns `{ message, code, errors? }`.
- Handle `ZodError` as 400, P2002 as 409 and P2025 as 404.

**Done when:** a test route that throws `HttpError(409, "x", "Y")` returns exactly that, and an unexpected error returns a plain 500 with no details.

#### [x] 0.4 Add the validation middleware

**Files:** `src/middlewares/validate.js`, `src/utils/validators.js`

- `validate({ body, query, params })` parses each part and stores results on `req.validated`.
- Add shared helpers: `isoDate`, `queryBoolean`, `commaList`, `pipeList`, `page`.

**Done when:** an invalid request returns 400 with a field-level `errors` list.

#### [x] 0.5 Add security and logging middleware

**Files:** `src/app.js`

- Install `helmet` and `morgan`. Limit JSON bodies with `express.json({ limit: "100kb" })`.
- Skip CORS, since only the Next.js server calls this API.

**Done when:** responses carry helmet headers and requests appear in the log.

#### [x] 0.6 Set up tests

**Files:** `tests/health.test.js`, `tests/helpers.js`, `.env.test`, `package.json`

- Install `supertest` and use Node's built-in test runner.
- Create a `hotel_jr_test` database with `createdb -h localhost -U postgres hotel_jr_test`.
- Add `.env.test`, plus scripts:
  - `"test": "node --env-file=.env.test --test --test-concurrency=1 \"tests/**/*.test.js\""`
  - `"test:db": "node --env-file=.env.test node_modules/.bin/prisma migrate deploy"`
- Tests import `app` from `src/app.js`, so no port is needed.
- `tests/helpers.js` refuses to run unless `NODE_ENV` is `test` and the database name ends in `_test`.

**Done when:** `npm test` passes a `GET /api/health` test against the test database.

---

### Phase 1: Accounts with JWT and bcrypt

#### [x] 1.1 Add the User model

- Add `User` and a `Role` enum to the schema.
- Run `npx prisma migrate dev --name add_users`.

**Done when:** the `User` table exists with a unique email.

#### [x] 1.2 Build `POST /auth/signup`

**Files:** `validators/auth.validator.js`, `services/auth.service.js`, `controllers/auth.controller.js`, `routers/auth.router.js`, `utils/token.js`

- Install `bcrypt` and `jsonwebtoken`. npm on this machine holds back install scripts, so confirm `bcrypt` loads. If it doesn't, run `npm install-scripts approve bcrypt` and reinstall it.
- Copy the rules from `frontend/src/schemas/signup.ts`: name 2-100, password 8-72 with a letter and a number. Also check the password is at most 72 bytes.
- Lowercase and trim the email.
- Hash with cost 12, create the user, return `{ token }` with status 201.
- JWT payload: `{ sub: user.id, role: user.role }`, signed with `env.JWT_SECRET`, expiring after `env.JWT_EXPIRES_IN`.
- Never return `passwordHash`.

**Done when:** tests cover success (201), duplicate email in a different case (409) and a weak password (400).

#### [x] 1.3 Build `POST /auth/login`

- Compare with `bcrypt.compare`. Return the same 401 message for an unknown email and a wrong password.
- Add a limiter with `express-rate-limit`: 10 failed tries per 15 minutes, **keyed on the lowercased email**, because all requests come from the Next.js server's IP.

**Done when:** tests cover success, wrong password, unknown email and the 429 limit.

#### [x] 1.4 Add auth middleware and `GET /auth/me`

**Files:** `middlewares/auth.js`

- `requireAuth` reads `Authorization: Bearer <token>`, verifies it, sets `req.user`, or returns 401.
- `optionalAuth` does the same but continues as a guest when there's no token. A present but invalid token still returns 401.
- `requireAdmin` returns 403 unless the user's current role in the database is `ADMIN`, so a role change applies straight away. Use it after `requireAuth`.
- `GET /auth/me` returns `{ id, fullName, email, phone, avatarUrl, role }`.

**Done when:** tests cover a valid, a missing and an expired token.

---

### Phase 2: Connect the frontend with axios

These tasks change `frontend/src/services/http.ts` only, so no other service needs editing. Everything still runs on sample data until task 10.12 sets `API_URL`.

#### [x] 2.1 Replace `fetch` with axios

**Files:** `frontend/src/services/http.ts`, `frontend/package.json`

- Install `axios` in `frontend`.
- Create one client: `axios.create({ baseURL: API_URL, timeout: 10000, adapter: "fetch" })`.
- Use `adapter: "fetch"` so calls still go through the `fetch` that Next.js manages, because `next.config.ts` turns on `cacheComponents`.
- Keep `ApiError`, `isApiEnabled`, `apiGet` and `apiPost` exactly as other files use them.
- Keep leaving out empty query params.
- Add a response interceptor that turns an axios error into `ApiError`, with `status` and the API's `code`. Use status 503 when there's no response.

**Done when:** `npm run build` passes, the site still works on sample data, and a test call with `API_URL` set reaches `/health` and maps a 404 to `ApiError`.

#### [ ] 2.2 Send the JWT with axios

**Files:** `frontend/src/services/http.ts`, `frontend/src/services/*.service.ts`

- Add an `{ auth: true }` option that reads the `session` cookie with `cookies()` and sets `Authorization: Bearer <token>`.
- **Don't do this in a global interceptor.** Reading `cookies()` on every call would stop public pages from being cached.
- Use it on the booking POST calls, so logged-in bookings link to the account.
- Add `apiPut`, `apiPatch` and `apiDelete`.

**Done when:** the frontend builds, the header is sent on `auth` calls only, and public pages stay static. A full login test comes in task 10.12.

---

### Phase 3: Cloudinary file storage

Folders are fixed in one list: `hotels`, `rooms`, `attractions`, `content`, `deals`, `guides`, `avatars`, `reviews`, `moments`, `support`, `properties`. Each sits under `hotel-jr/`.

#### [ ] 3.1 Connect Cloudinary

**You need to do this part:** create a Cloudinary account, then add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` to `backend/.env`. I can't create the account or type those keys for you.

**Files:** `src/config/cloudinary.js`, `src/config/env.js`, `.env.example`

- Install `cloudinary`, and import `{ v2 as cloudinary }`.
- Add the three variables to `env.js`, and placeholders to `.env.example`.
- Configure with `secure: true`.

**Done when:** a small script calling `cloudinary.api.ping()` succeeds, and a missing key stops the server with a clear message.

#### [ ] 3.2 Add `Asset` and the upload service

**Files:** `prisma/schema.prisma`, `services/upload.service.js`, `tests/upload.service.test.js`

- Add `Asset` and migrate.
- `uploadImage({ buffer, folder, userId })` uses `cloudinary.uploader.upload_stream` with `resource_type: "image"`, sends the buffer with `stream.end(buffer)`, and saves an `Asset` row.
- `deleteImage(id)` calls `cloudinary.uploader.destroy(publicId)`, then removes the row.
- If the database save fails after an upload, delete the file from Cloudinary, so nothing is orphaned.
- Tests replace Cloudinary with a stub, so they never use your account.

**Done when:** a real image uploads and shows at its URL, deleting removes it, and the tests pass offline.

#### [ ] 3.3 Add the upload middleware

**Files:** `middlewares/upload.js`, `middlewares/errorHandler.js`

- Install `multer` with memory storage, so nothing is written to disk.
- `uploadImage` accepts one `file`, up to 5 MB, of type JPEG, PNG or WebP.
- `uploadImages` accepts up to 6 files with the same rules.
- Turn `MulterError` into 400, or 413 for a file that's too large, with code `UPLOAD_ERROR`.

**Done when:** tests cover a good image, a large file, a wrong type and no file.

#### [ ] 3.4 Build the admin upload endpoints

**Files:** `validators/upload.validator.js`, `controllers/upload.controller.js`, `routers/admin.router.js`

- Check `folder` against the fixed list.
- Order of middleware: `requireAuth`, `requireAdmin`, upload, then validate. `multer` must run before the body can be read.

**Done when:** an admin can upload, list and delete an image, and a normal user gets 403.

#### [ ] 3.5 Add the seed image helper

**Files:** `prisma/seed-images.js`, `prisma/seed-data/image-map.json`

- `hostImage(url, folder)` uploads a remote image with `cloudinary.uploader.upload` and returns its Cloudinary URL.
- `hostImages(data, folder)` walks any JSON and replaces every `https://images.unsplash.com/` URL it finds.
- Use a `public_id` built from the source URL, and save results in `image-map.json`, so running a seed again uploads nothing new.
- Request Unsplash images at width 2000, so Cloudinary keeps a large original.
- Skip uploads when `NODE_ENV` is `test`.

**Done when:** two runs on the same sample URLs upload once and return the same result.

#### [ ] 3.6 Show Cloudinary images in the frontend

**Files:** `frontend/src/lib/imageLoader.ts`

- For `https://res.cloudinary.com/` URLs, insert `f_auto,q_<quality>,w_<width>,c_limit` after `/upload/`.
- Keep the Unsplash branch, because sample data still uses it until task 10.12.
- `next.config.ts` needs no change, because the custom loader handles every image.

**Done when:** a Cloudinary image loads on a page at the requested width.

---

### Phase 4: Hotels

#### [ ] 4.1 Replace `Room` with the hotel models

- Add `Hotel`, `Amenity`, `RoomType` and `Review` as in section 4, and remove `Room`. The table is empty, so nothing is lost.
- Delete `room.router.js`, `room.controller.js` and `room.service.js`, and remove the route from `routers/index.js`.
- Run `npx prisma migrate dev --name hotel_catalogue`.

**Done when:** the migration applies, the server starts, and `/api/rooms` returns 404.

#### [ ] 4.2 Export the sample data and seed the database

**Files:** `prisma/seed-data/hotels.json`, `prisma/seed.js`, `prisma.config.js`

- With a one-off `npx tsx` script in `frontend`, write the `hotels` array to JSON. Don't keep the script.
- Add `seed: "node prisma/seed.js"` under `migrations` in `prisma.config.js`.
- Pass the data through `hostImages`, so every image lives on Cloudinary.
- Seed amenities, hotels, room types and reviews with `upsert`, so running it twice is safe.
- `pricePerNight` is the lowest room price. `sortRank` keeps the sample order. `totalRooms` starts at 5.
- Keep the sample's `rating` and `reviewCount`.

**Done when:** `npx prisma db seed` runs twice with no duplicates, the row counts match the sample, and hotel images use Cloudinary URLs.

#### [ ] 4.3 Build the hotel mapper

**Files:** `mappers/hotel.mapper.js`, `tests/hotel.mapper.test.js`

- `toHotelSummary(hotel)` and `toHotelDetails(hotel)`.
- `featuredRoom` is the cheapest available room.
- Hide `sortRank` and other internal fields.

**Done when:** a test confirms the keys match `HotelSummary` and `HotelDetails`.

#### [ ] 4.4 Build `GET /hotels` and `GET /destinations`

**Files:** `services/hotel.service.js`, `controllers/hotel.controller.js`, `routers/hotel.router.js`, `routers/destination.router.js`

- `destinations` is the sorted list of distinct hotel cities.
- `hotels` matches `destination` case-insensitively on name, city or country.

**Done when:** `?destination=bali` returns the Bali hotels and `/destinations` returns city names.

#### [ ] 4.5 Build `GET /hotels/search` filters, sorting and paging

**Files:** `validators/hotel.validator.js`, `services/hotelSearch.service.js`, `utils/pagination.js`

- Build the Prisma `where` from each filter. For amenities use `AND: ids.map((id) => ({ amenities: { some: { id } } }))`, so a hotel needs all of them.
- Sort `recommended` by `sortRank`, or by the price or rating field for the others.
- Page size 5. Cap `page` at `pageCount`, and keep `pageCount` at 1 or more.
- Register this route above `/:slug`.

**Done when:** tests cover each filter, each sort, an empty result, and a `page` beyond the end.

#### [ ] 4.6 Add `priceRange` and `amenities` to the search

- Run a second query on the destination alone, before filters.
- Return `{ min: 0, max: 0 }` and an empty list when no hotels match.

**Done when:** applying a filter doesn't change `priceRange` or `amenities`.

#### [ ] 4.7 Build `GET /hotels/:slug`

- Include amenities, rooms and the latest 5 reviews. Throw 404 for an unknown slug.

**Done when:** the response matches `HotelDetails` and an unknown slug returns 404.

#### [ ] 4.8 Build `GET /hotels/:slug/similar`

- Six other hotels, closest in `pricePerNight`.
- Order with raw SQL: `ORDER BY ABS("pricePerNight" - $1)`.

**Done when:** the result leaves out the hotel itself and has 6 or fewer items.

---

### Phase 5: Page content

#### [ ] 5.1 Add `ContentBlock` and seed it

- Add the model and migrate.
- Export `homeContent`, `flightsContent`, `attractionsContent`, `carsContent`, `trainsContent`, `plannerContent` and `legalDocuments` from the frontend to `prisma/seed-data/content.json`, using the same one-off approach as task 4.2.
- The legal text is a draft, with `[square bracket]` gaps for a lawyer to fill. Keep `isDraft: true`.
- Pass the data through `hostImages`.
- `iconName` values must exist in `frontend/src/constants/icons.ts`.

**Done when:** rows exist for `home`, `flights`, `attractions`, `cars`, `trains`, `planner`, `legal-terms` and `legal-privacy`.

#### [ ] 5.2 Build the page content endpoints

**Files:** `services/content.service.js`, `controllers/content.controller.js`, `routers/content.router.js`

- Cover `/home`, `/flights/content`, `/attractions/content`, `/cars/content`, `/trains/content`, `/planner/content` and `/legal/:slug`.
- Return `data` as is. `/legal/:slug` accepts `terms` or `privacy`, and returns 404 for anything else.
- Mount this router before the product routers, so `content` isn't read as a `:slug`.

**Done when:** every response matches the sample data, apart from image URLs.

---

### Phase 6: Flights

#### [ ] 6.1 Add the flight models

- Add `Airport`, `Airline`, `FlightSchedule`, `FlightDeparture` and `FlightDeal`, then migrate.

**Done when:** the migration applies.

#### [ ] 6.2 Seed the flight data

- 14 airports from `frontend/src/data/airports.ts`, and the 4 fictional airlines from `flightOffers.ts`.
- For each pair of cities, create schedules each way, linked with `returnScheduleId`.
- Move the sample's repeatable `hash` logic into the seed, so times and fares look the same.
- Add the 12 deals from `flightDeals.ts`. Move any past dates forward.

**Done when:** every ordered city pair has schedules, and seeding twice creates no duplicates.

#### [ ] 6.3 Build fare calculation

**Files:** `services/flightPricing.service.js`, `tests/flightPricing.test.js`

- Pure functions, no database:
  - Cabin multipliers: Economy 1, Premium Economy 1.6, Business 3.2, First 5.
  - Round trip factor 1.8.
  - A repeatable day factor from the route and date.
  - Child fare is 75% of the adult fare.
- `pricePerAdult` is rounded, and `totalPrice = round(pricePerAdult * (adults + children * 0.75))`.

**Done when:** tests prove the same input gives the same price, and cover each cabin, one-way and children.

#### [ ] 6.4 Build the offer builder

**Files:** `services/flightOffer.service.js`, `mappers/flight.mapper.js`

- Turn schedules into `FlightOffer` objects for a given search.
- Offer id is `<outboundScheduleId>` for one-way and `<outboundScheduleId>_<inboundScheduleId>` for round trips, so it stays the same between requests.
- `seatsLeft` comes from `FlightDeparture`, and is only included when 5 or fewer remain.

**Done when:** the same search always gives the same ids and prices, and the shape matches `FlightOffer`.

#### [ ] 6.5 Build `GET /airports` and `GET /flights/deals`

- Airports return sorted city strings.
- Deals filter on `from` and `to` with case-insensitive text matching, and on `nonstop`. Leave out inactive and past deals.

**Done when:** `?from=lagos&nonstop=true` returns only matching deals.

#### [ ] 6.6 Build the basic `GET /flights/search`

**Files:** `validators/flight.validator.js`, `services/flightSearch.service.js`, `controllers/flight.controller.js`, `routers/flight.router.js`

- Require `from`, `to` and `departDate`, and require `returnDate` after `departDate` for round trips. `from` and `to` must differ.
- Return empty results for an unknown city, not an error.
- Apply `nonstop` first.
- Return all offers with paging, size 6.

**Done when:** a Lagos to London search returns offers, and bad dates return 400.

#### [ ] 6.7 Add flight filters and sorting

- Filter in memory, because prices are calculated rather than stored.
- `stops`: `min(stops, 2)` must be in the list, on the outbound leg.
- `departure`: morning 6-12, afternoon 12-18, evening 18-24, night 0-6, on the outbound hour.
- Sorts:
  - `best`: lowest `totalPrice + travelMinutes * 0.5`
  - `cheapest`: lowest `totalPrice`
  - `fastest`: lowest `travelMinutes`, both legs combined
  - `earliest`: lowest `outbound.departMinutes`

**Done when:** tests cover each filter and sort, with results matching the frontend's sample logic.

#### [ ] 6.8 Add the flight search summaries

- `priceRange` and `airlines` come from offers before filters.
- `fareCalendar` is 7 days, using 90% of the cheapest fare per day.
- `sortSummary` holds strings such as `$1,204` and `6h 20m`, built from filtered offers.

**Done when:** the response has all the fields of `FlightSearchResult`.

#### [ ] 6.9 Build `GET /flights/offers/:id`

- Takes the same search params as the search, and rebuilds the offer from its schedule ids.
- Returns 404 for a bad id or a schedule that doesn't match the route.

**Done when:** an id from a search returns the same offer at the same price.

---

### Phase 7: Attractions

#### [ ] 7.1 Add the attraction models

- Add `Attraction` and `TicketOption`, and update `Review`, as in section 4.
- Run `npx prisma migrate dev --name add_attractions`.

**Done when:** the migration applies and hotel details still return their reviews.

#### [ ] 7.2 Seed the attractions

- With a one-off `npx tsx` script in `frontend`, pass each item in `attractions` through `withAttractionDetails` and write the result to `prisma/seed-data/attractions.json`.
- Pass the data through `hostImages`.
- The sample ticket ids `standard`, `guided` and `private` repeat across attractions, so let the database create ids, and `upsert` on `(attractionId, name)`.
- `price` is the standard ticket's adult price. `sortRank` keeps the sample order. `dailyLimit` starts at 200.
- Keep the sample's `rating`, which is out of 5, and its `reviewCount`.

**Done when:** seeding twice creates no duplicates and the row counts match the sample.

#### [ ] 7.3 Build the attraction mapper

**Files:** `mappers/attraction.mapper.js`, `tests/attraction.mapper.test.js`

- `toAttraction(attraction)` and `toAttractionDetails(attraction)`.
- Reviews use the same shape as hotel reviews, so reuse that part of `hotel.mapper.js`.
- Hide `sortRank`, `dailyLimit` and other internal fields.

**Done when:** a test confirms the keys match `Attraction` and `AttractionDetails`.

#### [ ] 7.4 Build `GET /attractions/search`

**Files:** `validators/attraction.validator.js`, `services/attraction.service.js`, `controllers/attraction.controller.js`, `routers/attraction.router.js`

- Match `q` case-insensitively on name, city or country.
- Sort `recommended` by `sortRank`, `rating` highest first, and `price-asc` lowest first.
- Page size 8, using `utils/pagination.js` from task 4.5.
- Register this route above `/:slug`.

**Done when:** tests cover `q`, each category, `freeCancellation`, each sort, and a `page` beyond the end.

#### [ ] 7.5 Build `GET /attractions/:slug`

- Include tickets, cheapest first, and the latest 5 reviews. Throw 404 for an unknown slug.

**Done when:** the response matches `AttractionDetails` and an unknown slug returns 404.

#### [ ] 7.6 Build `GET /attractions/:slug/similar`

- Up to six other attractions, same category first, then by `sortRank`.

**Done when:** the result leaves out the attraction itself and lists same-category items first.

#### [ ] 7.7 Build `GET /planner/suggestions`

- Return every attraction as `{ id, slug, name, city, country, imageUrl, duration, price, currency }`.
- `price` must be a number here, because `PlannerSuggestion` doesn't accept a Decimal string.

**Done when:** the `/planner` page can list attractions from the API.

---

### Phase 8: Trains

The frontend's train pages already call these endpoints, so they must exist before task 10.12. Trains work like flights, so follow the same patterns.

#### [ ] 8.1 Add the train models

- Add `Station`, `TrainOperator`, `TrainSchedule` and `TrainDeparture`, then migrate.

**Done when:** the migration applies.

#### [ ] 8.2 Seed the train data

- The 21 stations and 3 fictional operators from `frontend/src/data/trainOffers.ts`.
- For each pair of stations, create schedules each way, linked with `returnScheduleId`.
- Move the sample's repeatable `hash` logic into the seed, so times and fares look the same.

**Done when:** every ordered station pair has schedules, and seeding twice creates no duplicates.

#### [ ] 8.3 Build train fares

**Files:** `services/trainPricing.service.js`, `tests/trainPricing.test.js`

- Pure functions, no database:
  - Class multipliers: Standard 1, First 1.7.
  - Round trip factor 1.8.
  - A repeatable day factor from the route and date.
  - Child fare is 50% of the adult fare.
- `pricePerAdult` is rounded, and `totalPrice = round(pricePerAdult * (adults + children * 0.5))`.

**Done when:** tests prove the same input gives the same price, and cover each class, one-way and children.

#### [ ] 8.4 Build the train offer builder

**Files:** `services/trainOffer.service.js`, `mappers/train.mapper.js`

- Turn schedules into `TrainOffer` objects for a given search.
- Build offer ids the same way as flights, so they stay the same between requests.
- `seatsLeft` comes from `TrainDeparture`, and is only included when 5 or fewer remain.
- `stops` and `stopCity` hold the changes, because the frontend reuses `FlightLeg`.

**Done when:** the same search always gives the same ids and prices, and the shape matches `TrainOffer`.

#### [ ] 8.5 Build `GET /trains/stations`

- Return sorted station names.

**Done when:** the response matches the frontend's `trainStations`.

#### [ ] 8.6 Build the basic `GET /trains/search`

**Files:** `validators/train.validator.js`, `services/trainSearch.service.js`, `controllers/train.controller.js`, `routers/train.router.js`

- Use the same search rules as flights: `from` and `to` must differ, and `returnDate` must follow `departDate` on round trips.
- Return empty results for an unknown station, not an error.
- Return all offers with paging, size 6.

**Done when:** a London to Paris search returns offers, and bad dates return 400.

#### [ ] 8.7 Add train filters and sorting

- `changes`: `min(changes, 2)` must be in the list, on the outbound leg.
- `operators`, `refundable`, and `departure` with the same hours as flights.
- The sorts match flights, except `best`, which is lowest `totalPrice + travelMinutes * 0.2`.

**Done when:** tests cover each filter and sort, with results matching the frontend's sample logic.

#### [ ] 8.8 Add the train search summaries

- `operators` lists each operator's lowest price, from offers before filters.
- `fareCalendar` is 7 days, using 90% of the cheapest fare per day.
- `sortSummary` uses filtered offers, like flights.

**Done when:** the response has all the fields of `TrainSearchResult`.

#### [ ] 8.9 Build `GET /trains/offers/:id`

- Takes the same search params as the search, and rebuilds the offer from its schedule ids.
- Returns 404 for a bad id or a schedule that doesn't match the route.

**Done when:** an id from a search returns the same offer at the same price.

---

### Phase 9: Cars

The frontend's car pages already call these endpoints, so they must exist before task 10.12.

#### [ ] 9.1 Add the car models

- Add `CarLocation`, `CarSupplier`, `CarClass` and `CarOffer`, then migrate.

**Done when:** the migration applies.

#### [ ] 9.2 Seed the car data

- Use the same 14 cities as `airports.ts` for locations, and the 3 fictional suppliers and 6 car classes from `frontend/src/data/carOffers.ts`.
- Create one `CarOffer` per supplier and class, with `fleetSize` starting at 5.
- Pass the data through `hostImages`.
- Move the sample's repeatable location factor into the seed, so prices look the same.

**Done when:** there are 18 offers, and seeding twice creates no duplicates.

#### [ ] 9.3 Build car prices

**Files:** `services/carPricing.service.js`, `tests/carPricing.test.js`

- `getRentalDays`: hours between pick-up and drop-off, divided by 24, rounded up, with a minimum of 1.
- `pricePerDay = round(dayPrice * supplier factor * location factor * age factor)`.
- The age factor is 1 for ages 25 to 69, and 1.15 otherwise.
- `totalPrice = pricePerDay * days`.

**Done when:** tests cover whole days, a part day, a non-standard age and each location factor.

#### [ ] 9.4 Build the car offer builder

**Files:** `services/carOffer.service.js`, `mappers/car.mapper.js`

- Turn `CarOffer` rows into the frontend's `CarOffer` shape for a given search.
- Keep the sample's order, which mixes car types, for the `recommended` sort.

**Done when:** the same search always gives the same ids and prices.

#### [ ] 9.5 Build `GET /cars/locations`

- Return sorted location names.

**Done when:** the names match the frontend's sample list.

#### [ ] 9.6 Build `GET /cars/search`

**Files:** `validators/car.validator.js`, `services/carSearch.service.js`, `controllers/car.controller.js`, `routers/car.router.js`

- Require `location`, the dates and the times. Drop-off must follow pick-up, by 30 days at most.
- Filter on `type`, `transmission`, `supplier` and `freeCancellation`.
- Sort `recommended` by sample order, `cheapest` by `totalPrice`, and `rating` by `supplierRating`.
- Page size 6. `suppliers` comes from offers before filters.

**Done when:** tests cover each filter, each sort, `days`, and a rental over 30 days.

#### [ ] 9.7 Build `GET /cars/offers/:id`

- Takes the same search params as the search. Returns 404 for a bad id.

**Done when:** an id from a search returns the same offer at the same price.

---

### Phase 10: Bookings

#### [ ] 10.1 Add the booking models

- Add `Booking`, `HotelStay`, `FlightTrip`, `Passenger`, `TicketBooking`, `TrainTrip`, `CarRental` and their enums, then migrate.

**Done when:** the migration applies.

#### [ ] 10.2 Add the booking helpers

**Files:** `utils/reference.js`, `utils/dates.js`, `utils/money.js`

- `generateReference()` returns `HJ-` plus 8 random characters from `crypto.randomInt`, leaving out `0`, `O`, `1` and `I`.
- `nightsBetween`, `isoToDate`, `dateToIso` and `isPastDate`, which compares against yesterday so guests ahead of the server's time zone can book today, as the frontend does.
- `samePrice(a, b)` allows a 1 cent difference.

**Done when:** unit tests cover these.

#### [ ] 10.3 Build the room availability check

**Files:** `services/availability.service.js`

- Load stays for the room type that overlap the dates, with status `CONFIRMED`: `checkIn < requestedCheckOut AND checkOut > requestedCheckIn`.
- Count rooms taken for **each night** and use the busiest night. Summing overlapping bookings would overstate it, because two bookings might not share a night.
- `getRoomsLeft(tx, roomTypeId, checkIn, checkOut)` returns `totalRooms - busiestNight`.

**Done when:** tests cover overlapping, touching (checkout day equals check-in day) and separate stays.

#### [ ] 10.4 Build `POST /bookings`

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

#### [ ] 10.5 Make hotels date-aware

- With `checkIn` and `checkOut`, `GET /hotels/:slug` sets each room's `isAvailable` from `getRoomsLeft`, using the requested `rooms` count.
- `GET /hotels/search` leaves out hotels with no room available for those dates and party size.
- Frontend: pass dates in `getHotelBySlug`, so the booking page's `checkRoom` sees real availability.

**Done when:** after filling a room for a date, it shows unavailable for those dates and available for others.

#### [ ] 10.6 Build `POST /flights/bookings`

Steps, in order:

1. Validate the body, including one passenger per traveller and the age rules: adults 18+, children 2-17 on the departure date.
2. Rebuild the offer from `offerId` and the search values, returning 404 if it's gone.
3. Check the departure date isn't past, and compare `total` against the rebuilt price.
4. In a transaction, for each leg, `upsert` the `FlightDeparture` row, then run `updateMany` with `seatsBooked: { lte: capacity - seats }` and `{ increment: seats }`. If it updates 0 rows, return 409 `SEATS_UNAVAILABLE`.
5. Create `Booking`, `FlightTrip` and `Passenger` rows.
6. Return 201 with `{ reference }`.

**Done when:** tests cover guest booking, a wrong total, a bad passenger count, an underage adult, and the last seats being taken by simultaneous requests.

#### [ ] 10.7 Build `POST /attractions/bookings`

Register this as `POST`, so it doesn't clash with `GET /attractions/:slug`.

Steps, in order:

1. Validate the body, matching `attractionBookingTripSchema`. `adults` is 1-10 and `children` is 0-10.
2. Load the attraction by `slug` and the ticket by `ticketId`. Return 404 if missing or the ticket belongs to another attraction.
3. Check the visit date isn't past.
4. Work out `adultPrice * adults + childPrice * children`. If it differs from the sent `total`, return 409 `PRICE_CHANGED`.
5. In a transaction, lock the ticket row with `SELECT id FROM "TicketOption" WHERE id = $1 FOR UPDATE`.
6. Add up tickets already sold for that date. If this order goes over `dailyLimit`, return 409 `TICKETS_UNAVAILABLE`.
7. Create `Booking` and `TicketBooking`, with a `voucherCode` built the same way as the reference.
8. Return 201 with `{ reference }`.

**Done when:** tests cover guest booking, a wrong total, another attraction's ticket, a past date, and two simultaneous orders for the last tickets where only one succeeds.

#### [ ] 10.8 Build `POST /trains/bookings`

Steps, in order:

1. Validate the body, matching `trainBookingTripSchema` and the lead traveller's details. Trains collect one name, not one per passenger.
2. Rebuild the offer from `offerId` and the search values, returning 404 if it's gone.
3. Check the departure date isn't past, and compare `total` against the rebuilt price.
4. Reserve seats on each leg with `TrainDeparture`, the same way as task 10.6. If there's no room, return 409 `SEATS_UNAVAILABLE`.
5. Create `Booking` and `TrainTrip`, and return 201 with `{ reference }`.

**Done when:** tests cover guest booking, a wrong total, a past date, and the last seats being taken by simultaneous requests.

#### [ ] 10.9 Build `POST /cars/bookings`

Steps, in order:

1. Validate the body, matching `carBookingTripSchema` and the driver's details.
2. Check the driver is at least 21 at pick-up, and that their age matches `isStandardAge`, because the price depends on it.
3. Check the rental is valid and pick-up isn't past.
4. Rebuild the offer, and compare `total` against the rebuilt price.
5. In a transaction, lock the `CarOffer` row. Count rentals that overlap these times, and if the fleet is full, return 409 `CARS_UNAVAILABLE`.
6. Create `Booking` and `CarRental`, and return 201 with `{ reference }`.

**Done when:** tests cover guest booking, a wrong total, each age rule, and two simultaneous bookings for the last car where only one succeeds.

#### [ ] 10.10 Build `POST /bookings/lookup`

**Files:** `mappers/booking.mapper.js`

- `toBookingRecord(booking)` builds `BookingRecord` for every booking type. `frontend/src/data/sampleBookings.ts` shows the expected text, such as `Garden Room, Bali`.
- Body is `{ reference, email }`. Use POST, so personal details don't go in URLs or logs.
- Uppercase the reference and lowercase the email.
- Return the same 404 for a wrong reference and a wrong email.
- Rate limit by reference.

**Done when:** a guest can find each booking type, and wrong details return 404.

#### [ ] 10.11 Show real booking errors in the frontend

**Files:** `frontend/src/actions/booking.ts`, `flightBooking.ts`, `attractionBooking.ts`, `trainBooking.ts`, `carBooking.ts`, `auth.ts`

- Read `code` from `ApiError`, which task 2.1 added.
- Show specific messages for `ROOM_SOLD_OUT`, `SEATS_UNAVAILABLE`, `TICKETS_UNAVAILABLE`, `CARS_UNAVAILABLE` and `PRICE_CHANGED`.
- Show a "too many attempts" message when login returns 429.

**Done when:** a sold-out room shows a clear message on the booking page.

#### [ ] 10.12 Switch the frontend to the API

- Add `API_URL=http://localhost:5000/api` to `frontend/.env.local`.
- Test in the browser: home, hotel search, details and booking, flight search and booking, attraction search, details and booking, train search and booking, car search and booking, find a booking, the planner, terms and privacy, sign up, log in.
- Fix any shape differences on the backend.

**Done when:** every flow above works with the data coming from PostgreSQL, and images from Cloudinary.

---

### Phase 11: Managing bookings

#### [ ] 11.1 Build `GET /bookings`

- The logged-in user's bookings as `BookingRecord`, newest first, with `?page` and `?status`. Leave out other users' bookings.

**Done when:** tests confirm users only see their own.

#### [ ] 11.2 Build `GET /bookings/:reference`

- Return 404, not 403, when it belongs to someone else, so references can't be probed.
- `canCancel` follows the rules in task 11.3.

**Done when:** owner gets 200 and another user gets 404.

#### [ ] 11.3 Build `POST /bookings/:reference/cancel`

- Logged-in owners need nothing else. Guests send `{ email }`.
- Hotels: allowed only if the stay has `freeCancellation` and check-in is more than 48 hours away, matching the sample policy text.
- Flights: allowed only if `refundable` and before departure. Reduce `seatsBooked` in the same transaction.
- Attractions: allowed only if the ticket has `freeCancellation` and the visit is more than 24 hours away, matching the sample policy text.
- Trains: allowed only if `refundable` and before departure. Reduce `seatsBooked` in the same transaction.
- Cars: allowed only if the rental has `freeCancellation` and pick-up is more than 48 hours away. The frontend doesn't name a time, so 48 hours is our default.
- Otherwise return 409 `NOT_CANCELLABLE`. Cancelling twice also returns this.

**Done when:** tests cover each rule, and cancelled rooms, seats, tickets and cars can be booked again.

#### [ ] 11.4 Send confirmation emails

**Files:** `services/email.service.js`

- Install `nodemailer`. In development, log the email instead of sending it, unless SMTP settings exist.
- Send after booking and after cancelling. Attraction emails include the voucher code. An email failure must not fail the booking.

**Done when:** a booking logs an email with the reference, and a forced email error still returns 201.

#### [ ] 11.5 Build the frontend pages

- `/bookings` already has the lookup form. Add a list for logged-in users, booking details and a cancel button.
- Add logging out, which deletes the `session` cookie. The server keeps no session to end.

**Done when:** a user can find, view and cancel a booking in the browser.

---

### Phase 12: Profile, favourites and reviews

#### [ ] 12.1 Build `PATCH /users/me`

- Update `fullName` and `phone` only.

**Done when:** extra fields such as `role` are ignored.

#### [ ] 12.2 Build profile photos

- `POST /users/me/avatar` uses the upload middleware and the `avatars` folder.
- Delete the previous image after a new one saves.

**Done when:** a new photo replaces the old one in Cloudinary and in `avatarUrl`.

#### [ ] 12.3 Build `POST /users/me/password`

- Requires the current password, and uses the signup password rules for the new one.
- Tokens are valid until they expire, even after a password change. Add `passwordChangedAt` to `User`, and reject tokens issued before it. Task 12.4 needs this too.

**Done when:** a wrong current password returns 401, and a token from before the change stops working.

#### [ ] 12.4 Build password reset

- Add `PasswordResetToken` with a hashed token, an expiry of 1 hour and single use.
- `forgot-password` always returns 200, so it doesn't reveal which emails exist.
- `reset-password` sets the password and uses up the token.
- Add the frontend pages.

**Done when:** a token works once, and an expired token fails.

#### [ ] 12.5 Build email verification

- Add `EmailVerificationToken`, and send a link after sign-up.
- Set `emailVerifiedAt` when confirmed.
- Task 14.6 needs this, because only verified accounts can spend coins.

**Done when:** a link confirms the email once only.

#### [ ] 12.6 Build favourites

- Add `Favorite` with `@@id([userId, hotelId])`.
- `PUT` is safe to repeat. `DELETE` returns 204.

**Done when:** tests cover saving twice and removing.

#### [ ] 12.7 Connect the favourite button

- `FavoriteButton` currently keeps its state in the browser only, with just a `label` prop. Give it a hotel id and a server action.
- Send guests to `/login`.

**Done when:** a saved hotel stays saved after a refresh.

#### [ ] 12.8 Build reviews

- `GET` is paginated.
- `POST` needs a finished, non-cancelled stay at that hotel, with one review per booking.
- Update `rating` with `(rating * reviewCount + score) / (reviewCount + 1)`. Don't average the `Review` rows, because seeded hotels show large review counts with only 5 rows.

**Done when:** tests cover a stay that hasn't ended, a second review, and the rating update.

#### [ ] 12.9 Add review photos

- Up to 6 images through `uploadImages`, into the `reviews` folder. Only the review's author can add them.
- Return `photos` with each review, and add the field to the frontend's `HotelReview` type.

**Done when:** photos appear with the review, and another user gets 403.

#### [ ] 12.10 Build the account pages

- Add `/account` for profile, password and saved hotels.
- Show the logged-in user in the navbar from `GET /auth/me`, without making public pages dynamic.

**Done when:** a user can edit their profile and see their saved hotels in the browser.

---

### Phase 13: Promotions and deals

trip.com's offers vary by product: 10% for new users, 8% on another page, 5% capped at US$7, and codes valid for 15 days after claiming. So every rule below is stored as data.

#### [ ] 13.1 Add promotions and `GET /promotions`

- `Promotion`: `code`, `title`, `terms`, `discountType` (`PERCENT` or `FIXED`), `discountValue`, `maxDiscount?`, `minSpend?`, `product`, `firstBookingOnly`, `claimValidDays?`, `startsAt`, `endsAt`, `isActive`.
- Seed the offers already shown on the home page.

**Done when:** only active offers are returned.

#### [ ] 13.2 Build claiming

- Add `UserPromotion` with `expiresAt` and `usedAt`. One claim per user.

**Done when:** a second claim returns 409, and `/users/me/promotions` lists claims.

#### [ ] 13.3 Build `POST /promotions/validate`

- Input is a code, product and amount. Output is the discount and final total, or a clear reason it can't be used.

**Done when:** tests cover min spend, the cap, expiry and first booking only.

#### [ ] 13.4 Apply promotions to bookings

- Add optional `promoCode` to every booking endpoint, and store `discount` on `Booking`.
- Recalculate the discount on the server, and mark it used inside the booking transaction.
- Give the promotion back when a booking is cancelled.

**Done when:** a simultaneous double use only succeeds once.

#### [ ] 13.5 Build sale campaigns and `GET /deals`

- `Campaign`: `slug`, `title`, `subtitle`, `headline` (such as `Up to 50% off`), `imageUrl`, `startsAt`, `endsAt`, `isActive`, and linked promotions, hotels and attractions.
- Banner images use the `deals` folder.
- `GET /deals` returns active campaigns, plus hot hotel and flight deals.

**Done when:** an ended campaign disappears without a code change.

#### [ ] 13.6 Build the deals page

- Add `/deals` with campaign tiles, and `/deals/:slug` for one campaign.

**Done when:** `/deals` shows offers from each product in the browser.

---

### Phase 14: Rewards

The starting values below come from trip.com's rewards page. They're stored in tables so Hotel Jr can change them. The name is "Jr Coins".

| Tier | Coin boost | How to reach it | How to keep it |
| --- | --- | --- | --- |
| Silver | none | Sign up | Permanent |
| Gold | +20% | 1 eligible booking | Permanent |
| Platinum | +50% | 3 eligible bookings | 3 eligible bookings a year |
| Diamond | +100% | 8 eligible bookings, US$1,000 total | The same, each year |
| Diamond+ | +150% | US$10,000 total | The same, each year |
| Black Diamond | +200% | Invitation only | Over US$20,000 a year |

Coins earned per US$100 of final payment: hotels 50, cruises 50, Flight + Hotel 35, flights 20, trains 20, airport transfers 20, cars 15, tours 15. trip.com's page doesn't list attractions, so we start them at 15.

#### [ ] 14.1 Add the rewards tables

- Add `RewardTier`, `EarnRate`, `TierPerk`, `Membership` and `CoinTransaction`, then seed the values above.
- `Membership`: `userId`, `tierId`, `tierExpiresAt?`, `yearBookings`, `yearSpend`.
- Create a Silver membership at sign-up, and for existing users.

**Done when:** a new user has a Silver membership.

#### [ ] 14.2 Add scheduled jobs

**Files:** `src/jobs/index.js`, `src/server.js`

- Install `node-cron`, and run one job file per task.
- Log failures, and don't let one job stop the others.

**Done when:** a test job runs on schedule and a failing job doesn't crash the server.

#### [ ] 14.3 Mark bookings as completed

- A daily job sets `completedAt`:
  - Hotels: after check-out.
  - Flights and trains: after the last departure.
  - Attractions: after the visit date.
  - Cars and transfers: after the service date.
  - Tours and cruises: after the trip ends.
- A combined booking counts as one.
- Reviews in task 12.8 then use `completedAt`.

**Done when:** tests cover each product type, and cancelled bookings are skipped.

#### [ ] 14.4 Earn coins

- `CoinTransaction` is a ledger: `userId`, `amount`, `reason`, `bookingId?`, `reviewId?`, `expiresAt?`, `remaining`.
- When a booking completes, add `final payment / 100 * rate`, plus the tier boost. Round down.
- Final payment means after discounts and coins. Refund fees never count.
- No coins on free bookings.

**Done when:** a completed booking earns coins once only, even if the job runs twice.

#### [ ] 14.5 Move members between tiers

- Upgrade as soon as a completed booking meets the next tier's rule.
- A yearly job checks Platinum and above, and moves members down if they missed the rule, never below Gold.
- Cancelled bookings stop counting. Black Diamond is set by an admin only.

**Done when:** tests cover an upgrade, a downgrade and the Gold floor.

#### [ ] 14.6 Spend coins

- Add optional `coins` to booking endpoints. 100 coins is about US$1. Only verified emails can spend them.
- Spend soonest-expiring coins first, inside the booking transaction.
- On a refund, return cash first, then coins with their original expiry.
- A balance can go negative after a cancellation.

**Done when:** a simultaneous double spend only succeeds once, and refunds restore the coins.

#### [ ] 14.7 Expire coins

- Booking coins last 18 months. Review coins last 6 months.
- A daily job writes an expiry entry for what's left in `remaining`.

**Done when:** expired coins leave the balance, and history shows why.

#### [ ] 14.8 Earn coins for reviews

- 10 coins under 20 characters, 20 for 20 to 50, 50 for more.
- +10 with a photo, +10 within 3 days of the stay, +50 if the hotel has under 15 reviews.
- Monthly cap of 1,200 coins.

**Done when:** tests cover each bonus and the cap.

#### [ ] 14.9 Build the rewards endpoints

- `GET /rewards/tiers` is public, and returns tiers, rules and perks.
- `GET /rewards` returns tier, progress to the next tier, balance and coins expiring soon.
- `GET /rewards/coins` is paginated history.

**Done when:** progress numbers match a hand-checked member.

#### [ ] 14.10 Build the rewards page

- Add `/rewards` and a coins box at checkout.
- `TierPerk` rows are shown as information only. See section 7.

**Done when:** a user can see their tier and spend coins on a booking in the browser.

---

### Phase 15: Payments and currency

Use Stripe test mode only, until you decide otherwise. **This phase needs your go-ahead** and a Stripe account, which you'd set up yourself.

#### [ ] 15.1 Start payments

- Add `Payment`: `bookingId`, `provider`, `providerRef`, `amount`, `currency`, `status`.
- `POST /payments/intents` creates a Stripe Payment Intent for a booking's server-side total.
- Bookings that need payment start unpaid, and their rooms, seats or tickets are held for 15 minutes.

**Done when:** a test booking creates an intent for the right amount.

#### [ ] 15.2 Confirm payments by webhook

- Bookings become `PAID` from the webhook only, never from the browser.
- Mount `/payments/webhook` with `express.raw()` **before** `express.json()`, or the signature check fails.
- Handle repeated webhook events safely.

**Done when:** a forged webhook is rejected, and a repeated event changes nothing.

#### [ ] 15.3 Refund payments

- Refund when a paid booking is cancelled, and record the result.
- Release held stock when a hold expires, using a scheduled job.

**Done when:** a cancelled test booking is refunded once only.

#### [ ] 15.4 Add payment to the booking forms

- Replace `OnlinePaymentNote` with a Stripe payment form on each booking page.

**Done when:** a Stripe test card pays a booking in the browser.

#### [ ] 15.5 Add currencies

- `ExchangeRate` table with USD as the base. Prices stay stored in USD.
- `GET /currencies`, plus `?currency=` on search and details.
- Bookings store the charged currency and amount.

**Done when:** a search in another currency converts prices and a booking saves the right amount.

#### [ ] 15.6 Connect the currency picker

- Add the `/currency` page linked from the navbar, and remember the choice in a cookie.

**Done when:** a chosen currency applies across the site.

---

### Phases 16 to 18: the pattern

Each new product builds its page and API together:

1. Add catalogue models and seed fictional data, using `hostImages`.
2. Add search, detail and booking endpoints.
3. Add a new `Booking.type`, with its own detail table.
4. Reuse the booking rules: server-side prices, locked stock, `PRICE_CHANGED`, and `{ reference }` in the response.
5. Add its cancellation rule to task 11.3's service, its completion rule to task 14.3, and its earn rate to `EarnRate`.
6. Build the frontend pages using the existing structure.

---

### Phase 16: Airport transfers, plus train and car extras

The core train and car journeys are in phases 8 to 10. These tasks add what else trip.com offers.

#### [ ] 16.1 Add and seed the transfer models

- `TransferVehicle`, starting with:

| Class | Passengers | Bags |
| --- | --- | --- |
| Economy | Up to 4 | 2 |
| SUV or minivan | 4 to 6 | 4 |
| Premium van | Up to 8 | 5 |
| Minibus | 9 to 14 | 6 |

- `TransferRate` prices each vehicle per airport and zone.

**Done when:** seeding twice creates no duplicates.

#### [ ] 16.2 Build `GET /transfers/search`

- Prices are per vehicle, not per passenger.
- Capacity rules: a bag over 24 inches counts as 2, and each child seat uses 1.5 seats.
- Leave out vehicles too small for the group.

**Done when:** tests cover each capacity rule.

#### [ ] 16.3 Build `POST /transfers/bookings`

- Add `TransferRide` and the `TRANSFER` booking type, with an optional flight number.
- Free cancellation up to 24 hours before pick-up. No refund after that.

**Done when:** tests cover cancelling on each side of the 24 hour limit.

#### [ ] 16.4 Send driver details

- A scheduled job emails driver details at least 12 hours before pick-up.
- For bookings made less than 14 hours before pick-up, send within 2 hours.

**Done when:** tests cover both timings, and each email sends once.

#### [ ] 16.5 Build the transfer pages

- Add `/airport-transfers`, results, booking and confirmation pages.

**Done when:** a user can book a transfer in the browser.

#### [ ] 16.6 Add train refund fees

- Refundable fares can carry an admin fee, recorded on the booking.

**Done when:** tests cover a refund with and without a fee.

#### [ ] 16.7 Build rail passes

- `RailPass` and `RailPassOrder`, sold as an e-ticket with a voucher code.

**Done when:** a pass order emails a voucher.

#### [ ] 16.8 Add railcards, buses and open returns

- Add `Railcard` discounts, a `mode` for buses, an open return trip type, and filters for duration and ticket flexibility.
- Add time pickers to the train search, which only has dates today.
- Collect ID numbers only on routes that need them, and keep them out of logs and API responses.

**Done when:** tests cover a railcard discount, a bus search and an open return.

#### [ ] 16.9 Add car rental details

- Add a licence issuing country, deposits, mileage terms, supplier cancellation windows and reviews.
- Deposits are paid at pick-up, so show them but leave them out of `total`.

**Done when:** an offer shows its deposit, and it doesn't change the total.

---

### Phase 17: Flight + Hotel

trip.com's page couldn't be read, so this design is ours, using the rules on its rewards page.

#### [ ] 17.1 Build `GET /packages/search`

- Combine flight offers and hotels for the same route and dates, with a package discount.

**Done when:** the package price is lower than booking each part alone.

#### [ ] 17.2 Build `POST /packages/bookings`

- Add `PackageBooking` and the `PACKAGE` type. One reference covers both parts.
- Reuse the checks from tasks 10.4 and 10.6 inside a single transaction, so if either part fails, neither is booked.

**Done when:** a sold-out room fails the whole package, and no seats are held.

#### [ ] 17.3 Add package rules

- A package counts as one booking for rewards, and earns no coins if its flight is cancelled.
- If an airline change means the guest misses check-in, the hotel can be cancelled free.

**Done when:** tests cover both rules.

#### [ ] 17.4 Build the package pages

- Add `/packages`, results and booking pages.

**Done when:** a user can book a package in the browser.

---

### Phase 18: Tours and cruises

trip.com's tours page couldn't be read, and its cruises page only shows a search box, so this design is ours.

#### [ ] 18.1 Add and seed the tour models

- `Tour` with `type` (`PRIVATE` or `GROUP`), and `TourDeparture` with date, seats and price.

**Done when:** seeding twice creates no duplicates.

#### [ ] 18.2 Build the tour endpoints

- `GET /tours` and `GET /tours/:slug`.

**Done when:** tests cover filtering by type and place.

#### [ ] 18.3 Add and seed the cruise models

- `Cruise`, and `CruiseSailing` with departure date, port, nights and price.

**Done when:** seeding twice creates no duplicates.

#### [ ] 18.4 Build the cruise endpoints

- `GET /cruises` searches by destination or cruise name, and departure date.
- `GET /cruises/:slug`.

**Done when:** tests cover both search inputs.

#### [ ] 18.5 Build enquiries

- `POST /enquiries` saves the request and emails the team. Tours and cruises use enquiries, not instant booking.
- Rate limit by email.

**Done when:** an enquiry is saved and emailed.

#### [ ] 18.6 Build the tour and cruise pages

- Add `/private-tours`, `/group-tours`, `/cruises` and their detail pages.

**Done when:** a user can send an enquiry in the browser.

---

### Phase 19: Guides, Moments, map and planner

#### [ ] 19.1 Build travel guides

- `Guide`: `slug`, `city`, `title`, `body`, `coverUrl`, `images String[]`, `publishedAt`.

**Done when:** `GET /guides?city=` returns published guides only.

#### [ ] 19.2 Build Moments

- `Moment`: `userId`, `title`, `location`, `text`, `photos String[]`, `status`.
- Photos go to the `moments` folder. Authors can delete their own, which also removes the files.
- New posts wait for an admin's approval.

**Done when:** an approved post appears, and a deleted post's images are gone from Cloudinary.

#### [ ] 19.3 Build the map endpoint

- Add `latitude` and `longitude` to `Hotel` and `Attraction`. `bbox` is `west,south,east,north`.

**Done when:** a map area returns only places inside it.

#### [ ] 19.4 Save trip plans to accounts

- The `/planner` page already works, and keeps plans in the browser. These endpoints let logged-in users keep them across devices.
- `Trip` and `TripItem`, with items pointing at hotels, flights or attractions, plus a date and notes.
- Only the owner can see a plan.

**Done when:** tests cover creating a plan, adding a stop and another user getting 404.

#### [ ] 19.5 Build the explore pages

- Add `/inspiration` and `/map`, and let logged-in users save `/planner` plans to their account.

**Done when:** a user can browse guides, use the map, and reopen a saved plan on another device.

---

### Phase 20: Flight extras

trip.com's flights page couldn't be read, so these come from search results about it.

#### [ ] 20.1 Add multi-city search

- Accept a list of legs, each with `from`, `to` and `date`, up to 5.
- Offer ids join each leg's schedule id, and booking stores each leg.

**Done when:** a three-leg trip can be searched and booked.

#### [ ] 20.2 Add price trends and alerts

- `GET /flights/price-trend` returns the lowest fare per day for a route.
- `PriceAlert`: `userId`, `from`, `to`, `departDate`, `targetPrice`, `lastNotifiedAt?`.
- A daily job emails users when the fare reaches their target.

**Done when:** an alert emails once when the fare drops, and not again the next day.

#### [ ] 20.3 Add flight status

- `GET /flights/status` takes a flight number and date. With no real airline feed, status is worked out from the schedule.

**Done when:** tests cover a flight before, during and after its schedule.

#### [ ] 20.4 Add bags and seats

- `FlightExtra` holds bag and seat options and prices.
- Add optional `extras` to `POST /flights/bookings`, priced on the server.

**Done when:** an added bag raises the total, and a tampered price is rejected.

---

### Phase 21: Support, partners and info pages

#### [ ] 21.1 Build FAQs

- `Faq`: `question`, `answer`, `product`, `sortRank`. Seed common questions on bookings, refunds and payments.

**Done when:** `GET /support/faqs?q=refund` returns matching help articles.

#### [ ] 21.2 Build support tickets

- `SupportTicket` with an optional booking, plus `SupportMessage`.
- Guests get replies by email. Rate limit by email.

**Done when:** a ticket can be submitted and shows under the user's account.

#### [ ] 21.3 Add support attachments

- Images go to the `support` folder. Only the owner and admins can see them.

**Done when:** another user can't read a ticket or its files.

#### [ ] 21.4 Build "List your property"

- `PropertyApplication` from a public form, with photos in the `properties` folder and a rate limit.

**Done when:** an application shows up for admins.

#### [ ] 21.5 Build supplier and affiliate forms

- `PartnerApplication` with a `type` of `SUPPLIER` or `AFFILIATE`.

**Done when:** an application shows up for admins.

#### [ ] 21.6 Build the info and support pages

- `GET /pages/:slug` reads `ContentBlock` for about, news, careers, accessibility, security, guarantee and service info. Terms and privacy already use `/legal/:slug`.
- Add `/support`, `/list-property`, `/suppliers`, `/affiliates` and the footer pages.

**Done when:** no sidebar or footer link leads to a missing page.

#### [x] 21.7 Build the travel assistant

- `POST /assistant/chat` streams Claude's reply as one JSON object per line. It needs a signed-in user, with a limit of 30 messages an hour each.
- It is switched off until `ANTHROPIC_API_KEY` is set. It has no access to prices, availability or bookings.

**Done when:** a signed-in user can chat on `/assistant`, and a reply can be stopped part way.

---

### Phase 22: Admin

#### [ ] 22.1 Create the first admin

- Add a script, `npm run admin:create`, that makes a user an admin.

**Done when:** that user passes `requireAdmin`.

#### [ ] 22.2 Manage hotels and rooms

- Validate all input, keep `Hotel.pricePerNight` equal to the lowest room price, and block deleting anything with active bookings.
- Images come from `/admin/uploads`. Delete a hotel's unused assets with it.

**Done when:** tests cover a non-admin getting 403 and the price staying correct.

#### [ ] 22.3 Manage flight deals and attractions

- Same rules as task 22.2.

**Done when:** a new attraction and its tickets can be booked.

#### [ ] 22.4 Manage other products

- One set of endpoints per product type, for trains, cars, tours and cruises.

**Done when:** an admin can add a tour without using the database directly.

#### [ ] 22.5 Manage bookings and users

- Paginated lists with filters. Never return password hashes.

**Done when:** an admin can find a booking and cancel it.

#### [ ] 22.6 Manage content, offers and requests

- Validate `ContentBlock` data with a Zod schema for each `key`.
- Add promotions, campaigns, support tickets, Moments approval and partner applications.

**Done when:** a change to the home content appears on the home page.

#### [ ] 22.7 Build `GET /admin/stats`

- Bookings, revenue and cancellations over a date range, per product.

**Done when:** totals match a hand-checked sample.

#### [ ] 22.8 Build the admin pages

- Add a protected `/admin` area for the endpoints above, including image uploads.

**Done when:** an admin can upload a photo and add a hotel in the browser.

---

### Phase 23: Production

#### [ ] 23.1 Write API docs

- Publish an OpenAPI file, served at `/api/docs` in development.

**Done when:** every endpoint is listed.

#### [ ] 23.2 Prevent double bookings

- Accept an `Idempotency-Key` header on booking endpoints, and send one from the booking forms.

**Done when:** the same key twice creates one booking.

#### [ ] 23.3 Tune performance

- Check slow queries with `EXPLAIN ANALYZE`, and add indexes as needed.
- Cache content and destinations briefly.

**Done when:** hotel and flight search stay fast with 10x the data.

#### [ ] 23.4 Add structured logs and monitoring

- Use `pino`, add request ids, and never log passwords, tokens, ID numbers or card details.
- Extend `/health` for uptime checks.

**Done when:** an error can be traced by request id.

#### [ ] 23.5 Add CI

- On each push, run install, migrations against a Postgres service, and tests.

**Done when:** a failing test fails the build.

#### [ ] 23.6 Deploy

- Add a production `Dockerfile`, run `prisma migrate deploy` on release, and use a managed Postgres with backups.
- Use separate Cloudinary folders or a separate account for production.
- Set `trust proxy` for the hosting platform, and test a restore.
- Rate limit counts live in the server's memory, so they reset on restart. Move them to a shared store such as Redis before running more than one server.

**Done when:** the production API serves the production frontend.

---

## 7. Not planned yet

These appear on trip.com, but need outside partners or a separate product. Tell me if you want any of them added.

- Real airline, hotel, rail and car supplier connections
- eSIM, travel insurance and gift cards
- Tier perks that depend on partners, such as airport lounges. They're shown on the rewards page only
- Live driver GPS tracking and in-app calling
- Live support chat, emergency assistance and phone lines
- AI trip planning, custom trips and personalised content
- More languages
- A mobile app
