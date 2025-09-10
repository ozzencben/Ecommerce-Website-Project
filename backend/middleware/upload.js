const multer = require("multer");
const { uploadToCloudinary } = require("../helpers/CloudinaryHelper");

// Memory storage: dosya buffer olarak tutulacak
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Tek dosya yükleme middleware
const singleUpload = (fieldName, folder) => [
  upload.single(fieldName),
  async (req, res, next) => {
    try {
      if (!req.file) return next();
      const result = await uploadToCloudinary(req.file.buffer, folder);
      req.file.cloudinary = result; // result.public_id ve result.secure_url
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
];

// Çoklu dosya yükleme middleware
const multipleUpload = (fieldName, folder, maxCount = 5) => [
  upload.array(fieldName, maxCount),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) return next();

      const uploadResults = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, folder);
        uploadResults.push(result);
      }
      req.files.cloudinary = uploadResults; // her dosya için result
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
];

module.exports = { singleUpload, multipleUpload };
