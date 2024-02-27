
import path from "path"
import fs from "fs"
import os from "os"
import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(os.tmpdir(), "images");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});
const multerFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
) {
    cb(null, true)
} else {
    cb(null, false)
}
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// const productImgResize = async (req:Request, res:Response, next:NextFunction) => {
//   if (!req.files) return next();
//   await Promise.all(
//     req.files?.map(async (file) => {
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/products/${file.filename}`);
//       fs.unlinkSync(`public/images/products/${file.filename}`);
//     })
//   );
//   next();
// };

// const blogImgResize = async (req, res, next) => {
//   if (!req.files) return next();
//   await Promise.all(
//     req.files.map(async (file) => {
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/blogs/${file.filename}`);
//       fs.unlinkSync(`public/images/blogs/${file.filename}`);
//     })
//   );
//   next();
// };
export { uploadPhoto, /*productImgResize, blogImgResize*/ };
