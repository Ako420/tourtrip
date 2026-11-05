import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import { cloudinary } from "../src/config/cloudinary.js";
import { prisma } from "../src/config/db.js";
import { deleteImage, uploadImage } from "../src/services/upload.service.js";
import { HttpError } from "../src/utils/httpError.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const buffer = Buffer.from("image bytes");

const cloudinaryResult = {
  public_id: "hotel-jr/hotels/abc123",
  secure_url: "https://res.cloudinary.com/test/image/upload/v1/hotel-jr/hotels/abc123.jpg",
  width: 2000,
  height: 1333,
  format: "jpg",
  bytes: 482113,
};

// Replaces the upload with a stub, so tests never reach Cloudinary.
const stubUpload = (t, { error = null, result = cloudinaryResult } = {}) => {
  const sent = [];
  const upload = t.mock.method(cloudinary.uploader, "upload_stream", (options, callback) => {
    return {
      end: (bytes) => {
        sent.push(bytes);
        callback(error, error ? undefined : result);
      },
    };
  });

  return { upload, sent };
};

const stubDestroy = (t, implementation = async () => ({ result: "ok" })) => {
  return t.mock.method(cloudinary.uploader, "destroy", implementation);
};

const createAsset = () => {
  return prisma.asset.create({
    data: {
      publicId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      folder: "hotels",
      width: 2000,
      height: 1333,
      format: "jpg",
      bytes: 482113,
    },
  });
};

const createUser = () => {
  return prisma.user.create({ data: { fullName: "Ada Obi", email: "ada@example.com", passwordHash: "x" } });
};

beforeEach(resetDatabase);
after(closeDatabase);

describe("uploadImage", () => {
  it("sends the buffer to the folder as an image", async (t) => {
    const { upload, sent } = stubUpload(t);

    await uploadImage({ buffer, folder: "hotels" });

    assert.equal(upload.mock.callCount(), 1);
    assert.deepEqual(upload.mock.calls[0].arguments[0], {
      folder: "hotel-jr/hotels",
      resource_type: "image",
      allowed_formats: ["jpg", "png", "webp"],
    });
    assert.deepEqual(sent, [buffer]);
  });

  it("saves and returns an Asset", async (t) => {
    stubUpload(t);

    const asset = await uploadImage({ buffer, folder: "hotels" });
    const saved = await prisma.asset.findUniqueOrThrow({ where: { id: asset.id } });

    assert.deepEqual(saved, asset);
    assert.equal(saved.publicId, "hotel-jr/hotels/abc123");
    assert.equal(saved.url, cloudinaryResult.secure_url);
    assert.equal(saved.folder, "hotels");
    assert.equal(saved.width, 2000);
    assert.equal(saved.height, 1333);
    assert.equal(saved.format, "jpg");
    assert.equal(saved.bytes, 482113);
    assert.equal(saved.uploadedById, null);
  });

  it("records who uploaded the image", async (t) => {
    stubUpload(t);

    const user = await createUser();
    const asset = await uploadImage({ buffer, folder: "avatars", userId: user.id });

    assert.equal(asset.uploadedById, user.id);
  });

  it("turns a rejected file into a 400", async (t) => {
    stubUpload(t, { error: { http_code: 400, message: "Invalid image file" } });

    await assert.rejects(uploadImage({ buffer, folder: "hotels" }), (error) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 400);
      assert.equal(error.code, "INVALID_IMAGE");

      return true;
    });
    assert.equal(await prisma.asset.count(), 0);
  });

  it("passes on any other Cloudinary failure", async (t) => {
    const outage = { http_code: 500, message: "Internal error" };

    stubUpload(t, { error: outage });

    await assert.rejects(uploadImage({ buffer, folder: "hotels" }), (error) => error === outage);
    assert.equal(await prisma.asset.count(), 0);
  });

  it("deletes the file from Cloudinary if the database save fails", async (t) => {
    stubUpload(t);

    const destroy = stubDestroy(t);

    await assert.rejects(uploadImage({ buffer, folder: "hotels", userId: "no-such-user" }), { code: "P2003" });
    assert.equal(destroy.mock.callCount(), 1);
    assert.equal(destroy.mock.calls[0].arguments[0], "hotel-jr/hotels/abc123");
    assert.equal(await prisma.asset.count(), 0);
  });

  it("still reports the database failure if the clean-up fails too", async (t) => {
    stubUpload(t);
    stubDestroy(t, async () => {
      throw new Error("Cloudinary is down");
    });

    const log = t.mock.method(console, "error", () => {});

    await assert.rejects(uploadImage({ buffer, folder: "hotels", userId: "no-such-user" }), { code: "P2003" });
    assert.equal(log.mock.callCount(), 1);
    assert.equal(log.mock.calls[0].arguments[0].message, "Cloudinary is down");
  });
});

describe("deleteImage", () => {
  it("removes the file from Cloudinary, clears its cache, and removes the row", async (t) => {
    const destroy = stubDestroy(t);
    const asset = await createAsset();

    await deleteImage(asset.id);

    assert.deepEqual(destroy.mock.calls[0].arguments, ["hotel-jr/hotels/abc123", { invalidate: true }]);
    assert.equal(await prisma.asset.count(), 0);
  });

  it("removes the row when Cloudinary no longer has the file", async (t) => {
    stubDestroy(t, async () => ({ result: "not found" }));

    const asset = await createAsset();

    await deleteImage(asset.id);

    assert.equal(await prisma.asset.count(), 0);
  });

  it("returns a 404 for an unknown image, without calling Cloudinary", async (t) => {
    const destroy = stubDestroy(t);

    await assert.rejects(deleteImage("no-such-image"), (error) => {
      assert.equal(error.status, 404);
      assert.equal(error.code, "IMAGE_NOT_FOUND");

      return true;
    });
    assert.equal(destroy.mock.callCount(), 0);
  });

  it("keeps the row if Cloudinary fails, so the delete can be tried again", async (t) => {
    stubDestroy(t, async () => {
      throw new Error("Cloudinary is down");
    });

    const asset = await createAsset();

    await assert.rejects(deleteImage(asset.id), { message: "Cloudinary is down" });
    assert.equal(await prisma.asset.count(), 1);
  });
});

describe("Asset", () => {
  it("keeps the image when its uploader's account is deleted", async (t) => {
    stubUpload(t);

    const user = await createUser();
    const { id } = await uploadImage({ buffer, folder: "avatars", userId: user.id });

    await prisma.user.delete({ where: { id: user.id } });

    const asset = await prisma.asset.findUniqueOrThrow({ where: { id } });

    assert.equal(asset.uploadedById, null);
  });
});
