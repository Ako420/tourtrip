import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedHotels } from "../prisma/seed-hotels.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/hotels.json", import.meta.url), "utf8"));

const PAGE_SIZE = 5;

const hasAmenity = (hotel, id) => hotel.amenities.some((amenity) => amenity.id === id);

const search = (query = "") => api.get(`/api/hotels/search${query && `?${query}`}`);

const slugs = (hotels) => hotels.map(({ slug }) => slug);

// Walks every page, so a test sees the whole result and not only the first five.
const searchAllPages = async (query = "") => {
  const first = await search(query);
  const pages = [first.body];

  for (let page = 2; page <= first.body.pageCount; page += 1) {
    pages.push((await search(`${query}&page=${page}`)).body);
  }

  return slugs(pages.flatMap(({ items }) => items));
};

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedHotels();
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/hotels/search results", () => {
  it("returns the first page in the sample order", async () => {
    const response = await search();

    assert.equal(response.status, 200);
    assert.deepEqual(slugs(response.body.items), slugs(samples.slice(0, PAGE_SIZE)));
  });

  it("returns hotels as HotelSummary", async () => {
    const response = await search();
    const [hotel] = response.body.items;
    const [sample] = samples;

    assert.equal(hotel.pricePerNight, "189.00");
    assert.equal(hotel.amenities.length, sample.amenities.length);
    assert.deepEqual(hotel.featuredRoom, sample.featuredRoom);
  });

  it("accepts everything the frontend sends", async () => {
    const query =
      "destination=Bali&rooms=2&adults=4&children=1&checkIn=2026-12-10&checkOut=2026-12-13" +
      "&minPrice=100&maxPrice=300&stars=5,4&minRating=8&amenities=pool,spa" +
      "&freeCancellation=true&breakfast=true&sort=price-asc&page=1";
    const response = await search(query);

    assert.equal(response.status, 200);
    assert.deepEqual(slugs(response.body.items), ["azure-cliff-resort"]);
  });

  it("treats empty values as not set", async () => {
    const query =
      "destination=&checkIn=&checkOut=&rooms=&adults=&children=&minPrice=&maxPrice=&stars=" +
      "&minRating=&amenities=&freeCancellation=&breakfast=&sort=&page=";
    const response = await search(query);

    assert.equal(response.status, 200);
    assert.equal(response.body.total, samples.length);
    assert.equal(response.body.page, 1);
  });

  it("treats false as not set", async () => {
    const response = await search("freeCancellation=false&breakfast=false");

    assert.equal(response.body.total, samples.length);
  });
});

describe("GET /api/hotels/search filters", () => {
  const filters = {
    "a destination": ["destination=bali", (hotel) => hotel.city === "Bali"],
    "a country": ["destination=Kenya", (hotel) => hotel.country === "Kenya"],
    "a minimum price, including that price": ["minPrice=199", (hotel) => hotel.pricePerNight >= 199],
    "a maximum price, including that price": ["maxPrice=199", (hotel) => hotel.pricePerNight <= 199],
    "a price between two values": ["minPrice=130&maxPrice=180", (hotel) => hotel.pricePerNight >= 130 && hotel.pricePerNight <= 180],
    "one star rating": ["stars=4", (hotel) => hotel.stars === 4],
    "several star ratings": ["stars=5,3", (hotel) => [5, 3].includes(hotel.stars)],
    "a minimum rating, including that rating": ["minRating=9", (hotel) => hotel.rating >= 9],
    "one amenity": ["amenities=beach", (hotel) => hasAmenity(hotel, "beach")],
    "every amenity listed": ["amenities=pool,spa", (hotel) => hasAmenity(hotel, "pool") && hasAmenity(hotel, "spa")],
    "free cancellation": ["freeCancellation=true", (hotel) => hotel.freeCancellation],
    breakfast: ["breakfast=true", (hotel) => hotel.breakfastIncluded],
    "both booking options": ["freeCancellation=true&breakfast=true", (hotel) => hotel.freeCancellation && hotel.breakfastIncluded],
    "several filters at once": [
      "minPrice=150&stars=5,4&amenities=wifi,pool&breakfast=true",
      (hotel) =>
        hotel.pricePerNight >= 150 &&
        [5, 4].includes(hotel.stars) &&
        hasAmenity(hotel, "wifi") &&
        hasAmenity(hotel, "pool") &&
        hotel.breakfastIncluded,
    ],
  };

  for (const [name, [query, matches]] of Object.entries(filters)) {
    it(`filters by ${name}`, async () => {
      const expected = slugs(samples.filter(matches));
      const response = await search(query);

      // A filter that matches nothing, or everything, wouldn't prove anything.
      assert.ok(expected.length > 0 && expected.length < samples.length);
      assert.equal(response.status, 200);
      assert.equal(response.body.total, expected.length);
      assert.deepEqual(await searchAllPages(query), expected);
    });
  }

  it("doesn't let a maximum price of 0 count as no filter", async () => {
    const response = await search("maxPrice=0");

    assert.equal(response.body.total, 0);
  });

  it("counts a star rating that no hotel has as no matches", async () => {
    const response = await search("stars=2");

    assert.equal(response.body.total, 0);
  });

  it("needs a hotel to have an amenity that exists", async () => {
    const response = await search("amenities=pool,not-an-amenity");

    assert.equal(response.body.total, 0);
  });

  it("keeps a % in the destination as plain text", async () => {
    const response = await search("destination=%25");

    assert.equal(response.body.total, 0);
  });
});

describe("GET /api/hotels/search sorting", () => {
  const sorts = {
    "the lowest price": ["price-asc", (a, b) => a.pricePerNight - b.pricePerNight],
    "the highest price": ["price-desc", (a, b) => b.pricePerNight - a.pricePerNight],
    "the top rating": ["rating", (a, b) => b.rating - a.rating],
  };

  for (const [name, [sort, compare]] of Object.entries(sorts)) {
    it(`sorts by ${name}`, async () => {
      assert.deepEqual(await searchAllPages(`sort=${sort}`), slugs(samples.toSorted(compare)));
    });
  }

  it("sorts recommended by the sample order", async () => {
    assert.deepEqual(await searchAllPages("sort=recommended"), slugs(samples));
  });

  it("sorts only the hotels that matched", async () => {
    const expected = samples.filter((hotel) => hotel.stars === 4).toSorted((a, b) => a.pricePerNight - b.pricePerNight);

    assert.deepEqual(await searchAllPages("stars=4&sort=price-asc"), slugs(expected));
  });

  describe("ties", () => {
    const { id, slug, amenities, rooms, reviews, featuredRoom, ...data } = samples[0];

    const addHotel = (id, sortRank) => {
      return prisma.hotel.create({ data: { ...data, id, slug: id, sortRank, city: "Tieville" } });
    };

    before(async () => {
      await addHotel("tie-z", 5);
      await addHotel("tie-a", 5);
      await addHotel("tie-m", 1);
    });

    after(() => prisma.hotel.deleteMany({ where: { city: "Tieville" } }));

    for (const sort of ["recommended", "price-asc", "price-desc", "rating"]) {
      it(`settles a tie in ${sort} by rank, then id`, async () => {
        const response = await search(`destination=Tieville&sort=${sort}`);

        assert.deepEqual(slugs(response.body.items), ["tie-m", "tie-a", "tie-z"]);
      });
    }
  });
});

describe("GET /api/hotels/search paging", () => {
  it("reports the page, the page count and the total", async () => {
    const response = await search();

    assert.equal(response.body.items.length, PAGE_SIZE);
    assert.equal(response.body.total, samples.length);
    assert.equal(response.body.page, 1);
    assert.equal(response.body.pageCount, 3);
  });

  it("returns the hotels of a later page", async () => {
    const response = await search("page=2");

    assert.equal(response.body.page, 2);
    assert.deepEqual(slugs(response.body.items), slugs(samples.slice(PAGE_SIZE, PAGE_SIZE * 2)));
  });

  it("returns what's left on the last page", async () => {
    const response = await search("page=3");

    assert.deepEqual(slugs(response.body.items), slugs(samples.slice(PAGE_SIZE * 2)));
  });

  it("shows every hotel exactly once across the pages", async () => {
    const found = await searchAllPages("sort=price-asc");

    assert.equal(found.length, samples.length);
    assert.equal(new Set(found).size, samples.length);
  });

  it("returns the last page for a page beyond the end", async () => {
    const response = await search("page=99");

    assert.equal(response.status, 200);
    assert.equal(response.body.page, 3);
    assert.deepEqual(slugs(response.body.items), slugs(samples.slice(PAGE_SIZE * 2)));
  });

  it("has no empty last page when the hotels fill a page exactly", async () => {
    const response = await search("stars=5");

    assert.equal(response.body.total, PAGE_SIZE);
    assert.equal(response.body.pageCount, 1);
  });

  it("counts the hotels that matched, not every hotel", async () => {
    const response = await search("breakfast=true");

    assert.equal(response.body.total, 7);
    assert.equal(response.body.pageCount, 2);
  });

  it("returns one empty page when nothing matches", async () => {
    const response = await search("destination=Atlantis");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.items, []);
    assert.equal(response.body.total, 0);
    assert.equal(response.body.page, 1);
    assert.equal(response.body.pageCount, 1);
  });

  it("returns page 1 for a page beyond the end of an empty result", async () => {
    const response = await search("destination=Atlantis&page=5");

    assert.equal(response.status, 200);
    assert.equal(response.body.page, 1);
    assert.deepEqual(response.body.items, []);
  });

  it("returns nothing when the minimum price is above the maximum", async () => {
    const response = await search("minPrice=300&maxPrice=100");

    assert.equal(response.status, 200);
    assert.equal(response.body.total, 0);
  });
});

describe("GET /api/hotels/search price range and amenities", () => {
  const inHotelNameOrPlace = (text) => (hotel) => {
    return [hotel.name, hotel.city, hotel.country].some((value) => value.toLowerCase().includes(text));
  };

  const getPriceRange = (hotels) => {
    const prices = hotels.map((hotel) => hotel.pricePerNight);

    return { min: Math.min(...prices), max: Math.max(...prices) };
  };

  const getAmenityIds = (hotels) => {
    return [...new Set(hotels.flatMap((hotel) => hotel.amenities.map(({ id }) => id)))].sort();
  };

  const ids = (amenities) => amenities.map(({ id }) => id).sort();

  it("covers every hotel when there's no destination", async () => {
    const { body } = await search();

    assert.deepEqual(body.priceRange, getPriceRange(samples));
    assert.deepEqual(ids(body.amenities), getAmenityIds(samples));
  });

  it("covers only the hotels at the destination", async () => {
    const hotels = samples.filter(inHotelNameOrPlace("or"));
    const { body } = await search("destination=or");

    assert.ok(hotels.length > 1 && hotels.length < samples.length);
    assert.notDeepEqual(getAmenityIds(hotels), getAmenityIds(samples));
    assert.deepEqual(body.priceRange, getPriceRange(hotels));
    assert.deepEqual(ids(body.amenities), getAmenityIds(hotels));
  });

  it("sends the price range as numbers, which the filter panel compares", async () => {
    const { body } = await search();

    assert.equal(typeof body.priceRange.min, "number");
    assert.equal(typeof body.priceRange.max, "number");
    assert.ok(body.priceRange.max > body.priceRange.min);
  });

  it("keeps cents in the price range", async () => {
    const { id, slug, amenities, rooms, reviews, featuredRoom, ...data } = samples[0];

    await prisma.hotel.create({ data: { ...data, slug: "cents-low", city: "Centsville", pricePerNight: "99.50" } });
    await prisma.hotel.create({ data: { ...data, slug: "cents-high", city: "Centsville", pricePerNight: "120.25" } });

    const { body } = await search("destination=Centsville");

    await prisma.hotel.deleteMany({ where: { city: "Centsville" } });

    assert.deepEqual(body.priceRange, { min: 99.5, max: 120.25 });
  });

  it("sends amenities with only the Amenity fields", async () => {
    const { body } = await search();

    for (const amenity of body.amenities) {
      assert.deepEqual(Object.keys(amenity).sort(), ["iconName", "id", "label"]);
    }
  });

  it("lists amenities by label", async () => {
    const { body } = await search();
    const labels = body.amenities.map(({ label }) => label);

    assert.deepEqual(labels, labels.toSorted());
  });

  it("leaves out an amenity no hotel has", async () => {
    await prisma.amenity.create({ data: { id: "unused", label: "Unused", iconName: "wifi" } });

    const { body } = await search();

    await prisma.amenity.delete({ where: { id: "unused" } });

    assert.ok(!ids(body.amenities).includes("unused"));
  });

  const filters = [
    "minPrice=150", "maxPrice=150", "stars=5", "minRating=9", "amenities=beach",
    "freeCancellation=true", "breakfast=true", "sort=price-desc", "page=2", "page=99",
  ];

  for (const destination of ["", "destination=or&"]) {
    for (const filter of filters) {
      it(`keeps both unchanged with ${destination}${filter}`, async () => {
        const { body: unfiltered } = await search(destination);
        const { body } = await search(`${destination}${filter}`);

        assert.deepEqual(body.priceRange, unfiltered.priceRange);
        assert.deepEqual(body.amenities, unfiltered.amenities);
      });
    }
  }

  it("keeps both when the filters match no hotels", async () => {
    const { body } = await search("destination=Bali&stars=3");
    const [hotel] = samples.filter(({ city }) => city === "Bali");

    assert.equal(body.total, 0);
    assert.deepEqual(body.priceRange, { min: hotel.pricePerNight, max: hotel.pricePerNight });
    assert.deepEqual(ids(body.amenities), getAmenityIds([hotel]));
  });

  for (const destination of ["Atlantis", "%25"]) {
    it(`returns zeros and no amenities for ${destination}`, async () => {
      const { body } = await search(`destination=${destination}`);

      assert.deepEqual(body.priceRange, { min: 0, max: 0 });
      assert.deepEqual(body.amenities, []);
    });
  }
});

describe("GET /api/hotels/search validation", () => {
  const rejected = {
    destination: [`destination=${"x".repeat(101)}`, "destination=Bali&destination=Rome"],
    checkIn: ["checkIn=tomorrow", "checkIn=2026-13-01"],
    checkOut: ["checkOut=tomorrow", "checkOut=2026-02-30"],
    rooms: ["rooms=0", "rooms=9", "rooms=1.5", "rooms=many"],
    adults: ["adults=0", "adults=17", "adults=1.5", "adults=many"],
    children: ["children=-1", "children=11", "children=1.5", "children=many"],
    minPrice: ["minPrice=-1", "minPrice=cheap", "minPrice=100000000", "minPrice=Infinity", "minPrice=1&minPrice=2"],
    maxPrice: ["maxPrice=-1", "maxPrice=cheap", "maxPrice=100000000", "maxPrice=Infinity", "maxPrice=1&maxPrice=2"],
    stars: ["stars=0", "stars=6", "stars=4.5", "stars=five", "stars=5,five", "stars=5&stars=4"],
    minRating: ["minRating=-1", "minRating=11", "minRating=high"],
    amenities: ["amenities=pool&amenities=spa", `amenities=${Array(21).fill("pool").join(",")}`],
    freeCancellation: ["freeCancellation=yes", "freeCancellation=1"],
    breakfast: ["breakfast=yes", "breakfast=1"],
    sort: ["sort=cheapest", "sort=sortRank"],
    page: ["page=0", "page=-1", "page=1.5", "page=last", "page=1&page=2"],
  };

  for (const [field, queries] of Object.entries(rejected)) {
    for (const query of queries) {
      it(`rejects ${query.slice(0, 40)}`, async () => {
        const response = await search(query);

        assert.equal(response.status, 400);
        assert.equal(response.body.code, "VALIDATION_ERROR");
        assert.ok(response.body.errors.some(({ path }) => path.split(".")[0] === field));
      });
    }
  }

  for (const query of ["destination=%00", "amenities=pool,%00"]) {
    it(`rejects the null byte in ${query}`, async () => {
      const response = await search(query);

      assert.equal(response.status, 400);
      assert.equal(response.body.code, "VALIDATION_ERROR");
    });
  }

  const accepted = [
    "rooms=1", "rooms=8", "adults=1", "adults=16", "children=0", "children=10",
    "stars=1", "stars=5", "minRating=0", "minRating=10", "minRating=8.5",
    "minPrice=0", "minPrice=99.50", "maxPrice=99999999.99", "minPrice=99999999.99",
    `amenities=${Array(20).fill("pool").join(",")}`,
  ];

  for (const query of accepted) {
    it(`accepts ${query.slice(0, 40)}`, async () => {
      const response = await search(query);

      assert.equal(response.status, 200);
    });
  }
});
