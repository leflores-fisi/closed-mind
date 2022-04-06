const cloudinary = require('cloudinary');

// credentials updated :'D
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const uploadMedia = async (path, type) => {
  return await cloudinary.v2.uploader.upload(path, {
    folder: 'closedmind-media',
    resource_type: 'auto'
  });
}
const deleteMedia = async (id) => {
  return await cloudinary.v2.uploader.destroy(id);
}

module.exports = { uploadMedia, deleteMedia }
