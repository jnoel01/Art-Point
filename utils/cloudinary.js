//https://github.com/itsmefarhan/nodejs-cloudinary-crud-operations/blob/master/routes/user.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "art-point",
	api_key: "441664597625179",
	api_secret: "4KF7kF-or8xea0oCXPq2XYqXWwM",
});

module.exports = cloudinary;
