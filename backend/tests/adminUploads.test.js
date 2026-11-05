import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import { cloudinary } from "../src/config/cloudinary.js";
import { prisma } from "../src/config/db.js";
import { signToken } from "../src/utils/token.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const FIVE_MB = 5 * 1024 * 1024;

const cloudinaryResult = {
  public_id: "hotel-jr/hotels/abc123",
  secure_url: "https://res.cloudinary.com/test/image/upload/v1/hotel-jr/hotels/abc123.jpg",
  width: 2000,
  height: 1333,
  format: "jpg",
  bytes: 482113,
};

// Replaces the upload with a stub, so tests never reach Cloudinary.
const stubUpload = (t, { error = null } = {}) => {
  return t.mock.method(cloudinary.uploader, "upload_stream", (options, callback) => {
    return { end: () => callback(error, error ? undefined : cloudinaryResult) };
  });
};

const stubDestroy = (t) => t.mock.method(cloudinary.uploader, "destroy", async () => ({ result: "ok" }));

const createUser = (email, role) => {
  return prisma.user.create({ data: { fullName: "Ada Obi", email, passwordHash: "x", role } });
};

const bearer = (user) => `Bearer ${signToken(user)}`;

const image = (contentType = "image/png", size = 5) => {
  return [Buffer.alloc(size, "x"), { filename: "photo.png", contentType }];
};

const createAsset = (index, overrides = {}) => {
  return prisma.asset.create({
    data: {
      publicId: `hotel-jr/hotels/image-${index}`,
      url: `https://res.cloudinary.com/test/image-${index}.jpg`,
      folder: "hotels",
      width: 100,
      height: 100,
      format: "jpg",
      bytes: 1000,
      createdAt: new Date(Date.UTC(2026, 0, 1, 0, index)),
      ...overrides,
    },
  });
};

let admin;
let user;

beforeEach(async () => {
  await resetDatabase();
  admin = await createUser("admin@example.com", "ADMIN");
  user = await createUser("user@example.com", "USER");
});

after(closeDatabase);

const upload = (who = admin, folder = "hotels", file = image()) => {
  return api.post("/api/admin/uploads").set("Authorization", bearer(who)).field("folder", folder).attach("file", ...file);
};

const list = (query = "", who = admin) => {
  return api.get(`/api/admin/uploads${query}`).set("Authorization", bearer(who));
};

const remove = (id, who = admin) => {
  return api.delete(`/api/admin/uploads/${id}`).set("Authorization", bearer(who));
};

describe("admin access", () => {
  const requests = {
    "POST /uploads": () => api.post("/api/admin/uploads").field("folder", "hotels").attach("file", ...image()),
    "GET /uploads": () => api.get("/api/admin/uploads"),
    "DELETE /uploads/:id": () => api.delete("/api/admin/uploads/some-id"),
    "an unknown admin route": () => api.get("/api/admin/nothing-here"),
  };

  for (const [name, send] of Object.entries(requests)) {
    it(`needs a login for ${name}`, async () => {
      const response = await send();

      assert.equal(response.status, 401);
      assert.equal(response.body.code, "AUTH_REQUIRED");
    });

    it(`blocks a normal user from ${name}`, async () => {
      const response = await send().set("Authorization", bearer(user));

      assert.equal(response.status, 403);
      assert.equal(response.body.code, "FORBIDDEN");
    });
  }

  it("doesn't send a normal user's file to Cloudinary", async (t) => {
    const stub = stubUpload(t);

    await upload(user);

    assert.equal(stub.mock.callCount(), 0);
    assert.equal(await prisma.asset.count(), 0);
  });

  it("blocks a demoted admin whose token still says ADMIN", async () => {
    const authorization = bearer(admin);

    await prisma.user.update({ where: { id: admin.id }, data: { role: "USER" } });

    const response = await api.get("/api/admin/uploads").set("Authorization", authorization);

    assert.equal(response.status, 403);
  });
});

describe("POST /api/admin/uploads", () => {
  it("uploads an image and returns its details", async (t) => {
    const stub = stubUpload(t);
    const response = await upload();
    const asset = await prisma.asset.findFirstOrThrow();

    assert.equal(response.status, 201);
    assert.deepEqual(response.body, {
      id: asset.id,
      publicId: "hotel-jr/hotels/abc123",
      url: cloudinaryResult.secure_url,
      folder: "hotels",
      width: 2000,
      height: 1333,
      format: "jpg",
      bytes: 482113,
      createdAt: asset.createdAt.toISOString(),
    });
    assert.equal(stub.mock.calls[0].arguments[0].folder, "hotel-jr/hotels");
  });

  it("records the admin who uploaded it", async (t) => {
    stubUpload(t);

    await upload();

    const asset = await prisma.asset.findFirstOrThrow();

    assert.equal(asset.uploadedById, admin.id);
  });

  const folders = [
    "hotels", "rooms", "attractions", "cars", "content", "deals",
    "guides", "avatars", "reviews", "moments", "support", "properties",
  ];

  for (const folder of folders) {
    it(`accepts the ${folder} folder`, async (t) => {
      stubUpload(t);

      const response = await upload(admin, folder);

      assert.equal(response.status, 201);
      assert.equal(response.body.folder, folder);
    });
  }

  for (const folder of ["secrets", "../hotels", "Hotels", ""]) {
    it(`rejects the folder "${folder}" without uploading`, async (t) => {
      const stub = stubUpload(t);
      const response = await upload(admin, folder);

      assert.equal(response.status, 400);
      assert.deepEqual(response.body.errors, [{ path: "folder", message: "Choose a valid folder" }]);
      assert.equal(stub.mock.callCount(), 0);
    });
  }

  it("rejects a missing folder", async (t) => {
    const stub = stubUpload(t);
    const response = await api
      .post("/api/admin/uploads")
      .set("Authorization", bearer(admin))
      .attach("file", ...image());

    assert.equal(response.status, 400);
    assert.equal(response.body.errors[0].path, "folder");
    assert.equal(stub.mock.callCount(), 0);
  });

  it("rejects a missing file", async (t) => {
    const stub = stubUpload(t);
    const response = await api
      .post("/api/admin/uploads")
      .set("Authorization", bearer(admin))
      .field("folder", "hotels");

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, { message: "Choose an image to upload", code: "UPLOAD_ERROR" });
    assert.equal(stub.mock.callCount(), 0);
  });

  it("rejects the wrong file type", async () => {
    const response = await upload(admin, "hotels", image("image/gif"));

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "UPLOAD_ERROR");
  });

  it("rejects a file over 5 MB", async () => {
    const response = await upload(admin, "hotels", image("image/png", FIVE_MB + 1));

    assert.equal(response.status, 413);
    assert.equal(response.body.code, "UPLOAD_ERROR");
  });

  it("reports a file Cloudinary won't accept", async (t) => {
    stubUpload(t, { error: { http_code: 400, message: "Invalid image file" } });

    const response = await upload();

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, { message: "This file isn't a valid image", code: "INVALID_IMAGE" });
    assert.equal(await prisma.asset.count(), 0);
  });

  it("hides a Cloudinary outage", async (t) => {
    stubUpload(t, { error: { http_code: 500, message: "cloud name is secret-cloud" } });
    t.mock.method(console, "error", () => {});

    const response = await upload();

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, { message: "Internal server error", code: "INTERNAL_ERROR" });
  });
});

describe("GET /api/admin/uploads", () => {
  it("returns an empty first page when there are no images", async () => {
    const response = await list();

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { items: [], total: 0, page: 1, pageCount: 1 });
  });

  it("lists the newest images first", async () => {
    await createAsset(1);
    await createAsset(2);

    const response = await list();

    assert.deepEqual(
      response.body.items.map(({ publicId }) => publicId),
      ["hotel-jr/hotels/image-2", "hotel-jr/hotels/image-1"],
    );
  });

  it("leaves out who uploaded each image", async () => {
    await createAsset(1, { uploadedById: admin.id });

    const response = await list();

    assert.equal(response.body.items[0].uploadedById, undefined);
    assert.equal(response.body.items[0].uploadedBy, undefined);
  });

  it("filters by folder", async () => {
    await createAsset(1);
    await createAsset(2, { folder: "rooms" });

    const response = await list("?folder=rooms");

    assert.equal(response.body.total, 1);
    assert.equal(response.body.items[0].folder, "rooms");
  });

  it("rejects an unknown folder", async () => {
    const response = await list("?folder=secrets");

    assert.equal(response.status, 400);
    assert.equal(response.body.errors[0].path, "folder");
  });

  it("returns 20 images a page", async () => {
    for (let index = 0; index < 21; index += 1) {
      await createAsset(index);
    }

    const first = await list();
    const second = await list("?page=2");

    assert.equal(first.body.items.length, 20);
    assert.deepEqual([first.body.total, first.body.page, first.body.pageCount], [21, 1, 2]);
    assert.equal(second.body.items.length, 1);
    assert.equal(second.body.items[0].publicId, "hotel-jr/hotels/image-0");
    assert.equal(second.body.page, 2);
  });

  it("caps a page beyond the end", async () => {
    await createAsset(1);

    const response = await list("?page=99");

    assert.equal(response.body.page, 1);
    assert.equal(response.body.items.length, 1);
  });

  it("rejects an invalid page", async () => {
    const response = await list("?page=0");

    assert.equal(response.status, 400);
    assert.equal(response.body.errors[0].path, "page");
  });
});

describe("DELETE /api/admin/uploads/:id", () => {
  it("deletes the image", async (t) => {
    const destroy = stubDestroy(t);
    const asset = await createAsset(1);
    const response = await remove(asset.id);

    assert.equal(response.status, 204);
    assert.equal(response.text, "");
    assert.equal(destroy.mock.calls[0].arguments[0], asset.publicId);
    assert.equal(await prisma.asset.count(), 0);
  });

  it("returns a 404 for an unknown image", async (t) => {
    const destroy = stubDestroy(t);
    const response = await remove("no-such-image");

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { message: "Image not found", code: "IMAGE_NOT_FOUND" });
    assert.equal(destroy.mock.callCount(), 0);
  });

  it("returns a 404 the second time", async (t) => {
    stubDestroy(t);

    const asset = await createAsset(1);

    await remove(asset.id);

    const response = await remove(asset.id);

    assert.equal(response.status, 404);
  });
});
