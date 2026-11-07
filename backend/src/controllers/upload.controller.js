import { toAsset } from "../mappers/asset.mapper.js";
import * as uploadService from "../services/upload.service.js";

export const createUpload = async (req, res) => {
  const asset = await uploadService.uploadImage({
    buffer: req.file.buffer,
    folder: req.validated.body.folder,
    userId: req.user.id,
  });

  res.status(201).json(toAsset(asset));
};

export const getUploads = async (req, res) => {
  const { items, ...pageInfo } = await uploadService.listImages(req.validated.query);

  res.json({ items: items.map(toAsset), ...pageInfo });
};

export const deleteUpload = async (req, res) => {
  await uploadService.deleteImage(req.validated.params.id);

  res.status(204).end();
};
