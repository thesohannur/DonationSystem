const cloudinary = require("cloudinary").v2; //Cloudinary is a cloud service for storing images and videos. 
                                             // That way we don't have to store media files directly on our server.

if (process.env.CLOUDINARY_URL) {
  // Supports full URL format from .env (cloudinary://api_key:api_secret@cloud_name)
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  // Backward-compatible fallback for split credentials.
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
}

module.exports = cloudinary;
