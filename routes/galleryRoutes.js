const express = require('express');
const router = express.Router();
const { uploadImage, getImages } = require('../controllers/galleryController');
const multer = require('multer');

// Multer Setup (for local handling before uploading to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('image'), uploadImage);
router.get('/', getImages);

module.exports = router;
