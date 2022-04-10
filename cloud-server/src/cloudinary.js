const cloudinary = require('cloudinary');

// credentials updated :'D
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// [ 'Extension', '.aac', '.abw', '.arc', '.avi', '.azw', '.bin', '.bmp', '.bz', '.bz2', '.csh', '.css', '.csv', '.doc', '.docx', '.eot', '.epub', '.gz', '.gif', '.htm.html', '.ico', '.ics', '.jar', '.jpeg .jpg', '.js', '.json', '.jsonld', '.mid .midi', '.mjs', '.mp3', '.mpeg', '.mpkg', '.odp', '.ods', '.odt', '.oga', '.ogv', '.ogx', '.opus', '.otf', '.png', '.pdf', '.php', '.ppt', '.pptx', '.rar', '.rtf', '.sh', '.svg', '.swf', '.tar', '.tif.tiff', '.ts', '.ttf', '.txt', '.vsd', '.wav', '.weba', '.webm', '.webp', '.woff', '.woff2', '.xhtml', '.xls', '.xlsx', '.xml', '.xul', '.zip', '.3gp', '.3g2', '.7z' ]

const uploadFile = async (path, format) => {
  return await cloudinary.v2.uploader.upload(path, {
    folder: 'closedmind-cloud',
    resource_type: 'auto',
    format: format,
  });
}
const deleteFile = async (id) => {
  return await cloudinary.v2.uploader.destroy(id);
}

module.exports = { uploadFile, deleteFile };
