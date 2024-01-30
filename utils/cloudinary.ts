// const cloudinary = require("cloudinary");
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads: string) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      fileToUploads,
      { resource_type: "auto" },
      (result) => {
        resolve({
          url: result?.secure_url,
          asset_id: result?.asset_id,
          public_id: result?.public_id,
        });
      }
    );
  });
};
const cloudinaryDeleteImg = async (public_id: string) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.destroy(public_id, (result) => {
      resolve({
        url: result.secure_url,
        asset_id: result.asset_id,
        public_id: result.public_id,
      });
    });
  });
};

export { cloudinaryUploadImg, cloudinaryDeleteImg };
