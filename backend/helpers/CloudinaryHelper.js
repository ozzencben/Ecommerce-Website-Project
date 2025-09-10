require("dotenv").config();
const cloudinary = require("../config/cloudinary");

/**
 * Dosyayı Cloudinary'ye yükler
 * @param {Buffer} fileBuffer - Dosya buffer'ı
 * @param {string} folder - Cloudinary klasör adı
 * @returns {Promise<Object>} - Yükleme sonucu
 */
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result); // result.public_id ve result.secure_url içerir
      })
      .end(fileBuffer);
  });
};

/**
 * Cloudinary'den dosya siler
 * @param {string} publicId - Silinecek dosyanın public_id'si
 * @returns {Promise<Object>}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) throw new Error("Public ID gerekli");
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
