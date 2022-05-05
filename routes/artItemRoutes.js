const express = require("express");
const router = express.Router();
const data = require("../data");
const artItemApi = require("../data/artItem");
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
router.get("/:id", async (req, res) => {
  let artId = req.params.id;
  console.log(artId);
  try {
    let art = await artItemApi.getArtItemById(artId);
    // res.send({
    //   artTitle: art.artTitle,
    //   artImage: "../public/no_image.jpeg",
    //   //artist: art.artist,
    //   artRating: art.artRating,
    //   typeGenre: art.typeGenre,
    //   forSale: art.forSale,
    //   setPrice: art.setPrice,
    //   purchasePage: "../views/pages/purchaseItem",
    // });
    res.render("../views/pages/artItem", {
      artTitle: art.artTitle,
      artImage: "../public/no_image.jpeg",
      artist: "balls",
      artRating: art.artRating,
      typeGenre: art.typeGenre,
      forSale: art.forSale,
      setPrice: art.setPrice,
      purchasePage: "../views/pages/purchaseItem",
    });
  } catch (e) {
    res.render("../views/pages/error", { error: e });
  }
});

module.exports = router;
