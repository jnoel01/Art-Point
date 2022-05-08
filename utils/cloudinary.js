//https://github.com/itsmefarhan/nodejs-cloudinary-crud-operations/blob/master/routes/user.js
const cloudinary = require("cloudinary").v2;
<<<<<<< Updated upstream
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
=======
const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
})

>>>>>>> Stashed changes

module.exports = cloudinary;
