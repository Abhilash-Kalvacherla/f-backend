const cloudinary = require('cloudinary').v2;
const Image = require('../models/Image');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;

    // Wrap upload_stream in a Promise
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(file.buffer);

    const newImage = new Image({
      url: result.secure_url,
      public_id: result.public_id,
      uploader: req.body.uploader || "Anonymous",
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Upload Failed" });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ date: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch images" });
  }
};
