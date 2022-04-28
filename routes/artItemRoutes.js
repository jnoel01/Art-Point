const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

router.get("/", async (req, res) => {
  res.render("../views/pages/artItem", {
    //will be replacing fields with database fields
    artTitle: "test image",
    artImage: "../public/no_image.jpeg",
    artist: "some artist",
    rating: 5,
    genre: "nature",
    forSale: true,
    salePrice: 5000,
    purchasePage: "../views/pages/purchaseItem",
  });
});

module.exports = router;
