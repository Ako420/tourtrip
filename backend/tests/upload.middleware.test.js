import assert from "node:assert/strict";
import { describe, it } from "node:test";
import express from "express";
import request from "supertest";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { receiveImage, receiveImages } from "../src/middlewares/upload.js";

const FIVE_MB = 5 * 1024 * 1024;

const describeFile = ({ originalname, mimetype, size, buffer, path }) => {
  return { originalname, mimetype, size, text: buffer.toString().slice(0, 5), path };
};

const app = express();

app.post("/one", receiveImage, (req, res) => res.json({ file: describeFile(req.file), body: req.body }));
app.post("/many", receiveImages, (req, res) => res.json({ files: req.files.map(describeFile) }));
app.use(errorHandler);

const api = request(app);

const image = (contentType = "image/png", size = 5) => {
  return [Buffer.alloc(size, "x"), { filename: "photo.png", contentType }];
};

const attachMany = (count, file = image()) => {
  let upload = api.post("/many");

  for (let index = 0; index < count; index += 1) {
    upload = upload.attach("files", ...file);
  }

  return upload;
};

const assertUploadError = (response, status, message) => {
  assert.equal(response.status, status);
  assert.deepEqual(response.body, { message, code: "UPLOAD_ERROR" });
};

describe("receiveImage", () => {
  for (const contentType of ["image/jpeg", "image/png", "image/webp"]) {
    it(`accepts ${contentType}`, async () => {
      const response = await api.post("/one").attach("file", ...image(contentType));

      assert.equal(response.status, 200);
      assert.equal(response.body.file.mimetype, contentType);
    });
  }

  it("keeps the file in memory, not on disk", async () => {
    const response = await api.post("/one").attach("file", ...image());

    assert.equal(response.body.file.text, "xxxxx");
    assert.equal(response.body.file.size, 5);
    assert.equal(response.body.file.path, undefined);
  });

  it("makes text fields available to the route", async () => {
    const response = await api.post("/one").field("folder", "hotels").attach("file", ...image());

    assert.deepEqual(response.body.body, { folder: "hotels" });
  });

  it("accepts a file of exactly 5 MB", async () => {
    const response = await api.post("/one").attach("file", ...image("image/png", FIVE_MB));

    assert.equal(response.status, 200);
    assert.equal(response.body.file.size, FIVE_MB);
  });

  it("rejects a file over 5 MB", async () => {
    const response = await api.post("/one").attach("file", ...image("image/png", FIVE_MB + 1));

    assertUploadError(response, 413, "Images must be 5 MB or smaller");
  });

  for (const contentType of ["image/gif", "image/svg+xml", "application/pdf", "text/plain"]) {
    it(`rejects ${contentType}`, async () => {
      const response = await api.post("/one").attach("file", ...image(contentType));

      assertUploadError(response, 400, "Upload a JPEG, PNG or WebP image");
    });
  }

  it("rejects a form with no file", async () => {
    const response = await api.post("/one").field("folder", "hotels");

    assertUploadError(response, 400, "Choose an image to upload");
  });

  it("rejects a JSON body", async () => {
    const response = await api.post("/one").send({ file: "photo.png" });

    assertUploadError(response, 400, "Choose an image to upload");
  });

  it("rejects a request with no body", async () => {
    const response = await api.post("/one");

    assertUploadError(response, 400, "Choose an image to upload");
  });

  it("rejects the wrong field name", async () => {
    const response = await api.post("/one").attach("photo", ...image());

    assertUploadError(response, 400, "We couldn't read that upload");
  });

  it("rejects a second file", async () => {
    const response = await api.post("/one").attach("file", ...image()).attach("file", ...image());

    assertUploadError(response, 400, "We couldn't read that upload");
  });

  it("rejects too many text fields", async () => {
    let upload = api.post("/one").attach("file", ...image());

    for (let index = 0; index < 6; index += 1) {
      upload = upload.field(`field${index}`, "x");
    }

    const response = await upload;

    assertUploadError(response, 400, "We couldn't read that upload");
  });

  it("rejects a multipart request with no boundary", async () => {
    const response = await api.post("/one").set("Content-Type", "multipart/form-data").send("broken");

    assertUploadError(response, 400, "We couldn't read that upload");
  });

  it("rejects a multipart body that stops early", async () => {
    const response = await api
      .post("/one")
      .set("Content-Type", "multipart/form-data; boundary=abc")
      .send('--abc\r\nContent-Disposition: form-data; name="file"; filename="a.png"\r\nContent-Type: image/png\r\n\r\nxx');

    assertUploadError(response, 400, "We couldn't read that upload");
  });
});

describe("receiveImages", () => {
  it("accepts up to 6 files", async () => {
    const response = await attachMany(6);

    assert.equal(response.status, 200);
    assert.equal(response.body.files.length, 6);
  });

  it("accepts a single file", async () => {
    const response = await attachMany(1);

    assert.equal(response.status, 200);
    assert.equal(response.body.files.length, 1);
  });

  it("rejects a 7th file", async () => {
    const response = await attachMany(7);

    assertUploadError(response, 400, "Upload up to 6 images at a time");
  });

  it("rejects the whole upload if one file is the wrong type", async () => {
    const response = await api.post("/many").attach("files", ...image()).attach("files", ...image("image/gif"));

    assertUploadError(response, 400, "Upload a JPEG, PNG or WebP image");
  });

  it("rejects the whole upload if one file is over 5 MB", async () => {
    const response = await api
      .post("/many")
      .attach("files", ...image())
      .attach("files", ...image("image/png", FIVE_MB + 1));

    assertUploadError(response, 413, "Images must be 5 MB or smaller");
  });

  it("rejects a form with no files", async () => {
    const response = await api.post("/many").field("folder", "reviews");

    assertUploadError(response, 400, "Choose an image to upload");
  });
});
