import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { createImageHost, hostImage, hostImages } from "../prisma/seed-images.js";
import { cloudinary } from "../src/config/cloudinary.js";

const PHOTO = "photo-1571896349842-33c89424de2d";
const SMALL_URL = `https://images.unsplash.com/${PHOTO}?auto=format&fit=crop&w=800&q=75`;
const LARGE_URL = `https://images.unsplash.com/${PHOTO}?auto=format&fit=crop&w=2000&q=75`;
const OTHER_URL = "https://images.unsplash.com/photo-222?auto=format&fit=crop&w=600&q=75";

const hostedUrl = (photoId) => `https://res.cloudinary.com/test/image/upload/v1/hotel-jr/${photoId}.jpg`;

// Replaces the upload with a stub, so tests never reach Cloudinary.
const stubUpload = (t) => {
  return t.mock.method(cloudinary.uploader, "upload", async (url) => {
    return { secure_url: hostedUrl(new URL(url).pathname.slice(1)) };
  });
};

let directory;
let mapPath;

const createHost = () => createImageHost({ mapPath, skipUploads: false });

const readSavedMap = () => JSON.parse(readFileSync(mapPath, "utf8"));

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "seed-images-"));
  mapPath = join(directory, "image-map.json");
});

afterEach(() => rmSync(directory, { recursive: true }));

describe("hostImage", () => {
  it("uploads the photo at full width and returns its Cloudinary URL", async (t) => {
    const upload = stubUpload(t);
    const url = await createHost().hostImage(SMALL_URL, "hotels");
    const [source, options] = upload.mock.calls[0].arguments;

    assert.equal(url, hostedUrl(PHOTO));
    assert.equal(new URL(source).searchParams.get("w"), "2000");
    assert.deepEqual(options, {
      public_id: PHOTO,
      folder: "hotel-jr/hotels",
      resource_type: "image",
      overwrite: false,
    });
  });

  it("uploads a photo only once", async (t) => {
    const upload = stubUpload(t);
    const host = createHost();
    const first = await host.hostImage(SMALL_URL, "hotels");
    const second = await host.hostImage(SMALL_URL, "hotels");

    assert.equal(upload.mock.callCount(), 1);
    assert.equal(second, first);
  });

  it("treats the same photo at another width as the same image", async (t) => {
    const upload = stubUpload(t);
    const host = createHost();
    const first = await host.hostImage(SMALL_URL, "hotels");
    const second = await host.hostImage(LARGE_URL, "rooms");

    assert.equal(upload.mock.callCount(), 1);
    assert.equal(second, first);
  });

  it("saves the map in a stable order", async (t) => {
    stubUpload(t);

    const host = createHost();

    await host.hostImage(OTHER_URL, "hotels");
    await host.hostImage(SMALL_URL, "hotels");

    assert.deepEqual(Object.keys(readSavedMap()), [PHOTO, "photo-222"]);
  });

  it("creates the map file on first use", async (t) => {
    stubUpload(t);
    assert.equal(existsSync(mapPath), false);

    await createHost().hostImage(SMALL_URL, "hotels");

    assert.deepEqual(readSavedMap(), { [PHOTO]: hostedUrl(PHOTO) });
  });

  const otherUrls = {
    "a Cloudinary URL": "https://res.cloudinary.com/test/image/upload/photo.jpg",
    "another host": "https://example.com/photo.jpg",
    "a look-alike host": "https://images.unsplash.com.example.com/photo.jpg",
    "plain text": "Azure Cliff Resort",
    "text that mentions a photo": `See ${SMALL_URL}`,
  };

  for (const [name, value] of Object.entries(otherUrls)) {
    it(`leaves ${name} alone`, async (t) => {
      const upload = stubUpload(t);

      assert.equal(await createHost().hostImage(value, "hotels"), value);
      assert.equal(upload.mock.callCount(), 0);
    });
  }

  it("names the photo when an upload fails", async (t) => {
    t.mock.method(cloudinary.uploader, "upload", async () => {
      throw { http_code: 420, message: "Rate limit exceeded" };
    });

    await assert.rejects(createHost().hostImage(SMALL_URL, "hotels"), {
      message: `Could not host ${SMALL_URL}: Rate limit exceeded`,
    });
    assert.equal(existsSync(mapPath), false);
  });

  it("keeps finished uploads when a later one fails, so a rerun carries on", async (t) => {
    const upload = stubUpload(t);
    const host = createHost();

    await host.hostImage(SMALL_URL, "hotels");
    upload.mock.mockImplementationOnce(async () => {
      throw new Error("Network down");
    });

    await assert.rejects(host.hostImage(OTHER_URL, "hotels"));
    assert.deepEqual(Object.keys(readSavedMap()), [PHOTO]);

    await createHost().hostImages([SMALL_URL, OTHER_URL], "hotels");

    assert.deepEqual(Object.keys(readSavedMap()), [PHOTO, "photo-222"]);
    assert.equal(upload.mock.callCount(), 3);
  });
});

describe("hostImages", () => {
  const sample = {
    name: "Azure Cliff Resort",
    stars: 5,
    isOpen: true,
    closedOn: null,
    imageUrl: SMALL_URL,
    images: [SMALL_URL, OTHER_URL],
    rooms: [{ id: "1-1", imageUrl: OTHER_URL, beds: ["king"] }],
  };

  const expected = {
    ...sample,
    imageUrl: hostedUrl(PHOTO),
    images: [hostedUrl(PHOTO), hostedUrl("photo-222")],
    rooms: [{ id: "1-1", imageUrl: hostedUrl("photo-222"), beds: ["king"] }],
  };

  it("replaces every Unsplash URL at any depth, and nothing else", async (t) => {
    stubUpload(t);

    assert.deepEqual(await createHost().hostImages(sample, "hotels"), expected);
  });

  it("leaves the original data unchanged", async (t) => {
    stubUpload(t);

    const original = structuredClone(sample);

    await createHost().hostImages(sample, "hotels");

    assert.deepEqual(sample, original);
  });

  it("uploads once across two runs and returns the same result", async (t) => {
    const upload = stubUpload(t);
    const first = await createHost().hostImages(sample, "hotels");
    const second = await createHost().hostImages(sample, "hotels");

    assert.equal(upload.mock.callCount(), 2);
    assert.deepEqual(second, first);
  });
});

describe("test mode", () => {
  it("skips uploads when told to", async (t) => {
    const upload = stubUpload(t);
    const host = createImageHost({ mapPath, skipUploads: true });

    assert.equal(await host.hostImage(SMALL_URL, "hotels"), SMALL_URL);
    assert.deepEqual(await host.hostImages({ imageUrl: SMALL_URL }, "hotels"), { imageUrl: SMALL_URL });
    assert.equal(upload.mock.callCount(), 0);
    assert.equal(existsSync(mapPath), false);
  });

  it("is on by default when NODE_ENV is test", async (t) => {
    const upload = stubUpload(t);

    assert.equal(await hostImage(SMALL_URL, "hotels"), SMALL_URL);
    assert.deepEqual(await hostImages([SMALL_URL], "hotels"), [SMALL_URL]);
    assert.equal(upload.mock.callCount(), 0);
  });
});
