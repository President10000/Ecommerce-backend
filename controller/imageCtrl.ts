// const fs = require("fs");
import fs from "fs";
// const asyncHandler = require("express-async-handler");
import asyncHandler from "express-async-handler";

// const {
//   cloudinaryUploadImg,
//   cloudinaryDeleteImg,
// } = require("../utils/cloudinary");
import { cloudinaryUploadImg, cloudinaryDeleteImg } from "../utils/cloudinary";
import { Request, Response } from "express";
import { } from "multer"
type cloudinaryRes = { asset_id: string; url: string; public_id: string };


const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const uploader = (path: string) => cloudinaryUploadImg(path);
    const urls: cloudinaryRes[] = [];
   if(req.files){
    const files = req.files as Express.Multer.File[] //| { [fieldname: string]: Express.Multer.File[] };
    for (const file of files) {
      const { path } = file;
      const newpath = (await uploader(path)) as cloudinaryRes;
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
   }
    // const images = urls.map((file) => {
    //   return file;
    // });
    if (urls[0].asset_id) {
      res.json(urls);
    } else {
      res.status(500).send("Internal server error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id: body_id } = req.body;
  const { id: param_id } = req.params;
  const { populate, id: query_id } = req.query;
  let id = param_id || query_id || body_id;
  try {
    const deleted = await cloudinaryDeleteImg(id);
    res.json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

export { uploadImages, deleteImages };
