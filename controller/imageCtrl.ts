import fs from "fs";
import asyncHandler from "express-async-handler";

import { cloudinaryUploadImg, cloudinaryDeleteImg } from "../utils/cloudinary";
import { Request, Response } from "express";
type cloudinaryRes = { asset_id: string; url: string; public_id: string };

const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const uploader = (path: string) => cloudinaryUploadImg(path);
  const urls: cloudinaryRes[] = [];
  if (req.files) {
    const files = req.files as Express.Multer.File[];
    for (const file of files) {
      const { path } = file;
      const newpath = (await uploader(path)) as cloudinaryRes;
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
  }

  if (urls[0].asset_id) {
    res.json(urls);
  } else {
    throw new Error("server error : asset_id did not found");
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await cloudinaryDeleteImg(id);
  res.json(deleted);
});

export { uploadImages, deleteImages };
