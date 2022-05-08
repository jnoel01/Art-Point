const express = require("express");
const session = require("express-session");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const artItemApi = require("../data/artItem");

const { ObjectId } = require("mongodb");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// router.get("/", async (req, res) => {
//   res.render("../views/pages/artItem", {
//     //will be replacing fields with database fields
//     artTitle: "test image",
//     artImage: "../public/no_image.jpeg",
//     artist: "some artist",
//     rating: 5,
//     genre: "nature",
//     forSale: true,
//     salePrice: 5000,
//     purchasePage: "../views/pages/purchaseItem",
//   });
// });
router.get("/:id", async (req, res) => {
  let artId = req.params.id;
  //console.log(artId);
  try {
    let art = await artItemApi.getArtItemById(artId);
    let artist = await userData.getUser(ObjectId(art.userId));
    req.session.artId = art._id;
    res.render("../views/pages/artItem", {
      artTitle: art.artTitle,
      artDescription: art.artDescription,
      imageSource: art.imageSource,
      artist: artist.userName,
      artRating: art.artRating,
      artId: art._id,
      typeGenre: art.typeGenre,
      forSale: art.forSale,
      setPrice: art.setPrice,
      purchasePage: "../views/pages/purchaseItem",
    });
  } catch (e) {
    res.render("../views/pages/error", { error: e });
  }
});

router.post("/submitart", upload.single("image"), async (req, res) => {
  //console.log("inside submit art");
  try {
    let artSubmissionInfo = req.body;
    // checking art title
    if (!artSubmissionInfo.artTitle) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a title for your art",
      });
      return;
    }
    if (artSubmissionInfo.artTitle !== "string") {
      res.status(400).render("../views/pages/create", {
        error: "Title must be a string",
      });
      return;
    }
    if (artSubmissionInfo.artTitle.trim().length === 0) {
      res.status(400).render("../views/pages/create", {
        error: "Title cannot be an empty string or string with just spaces",
      });
      return;
    }

    artSubmissionInfo.artTitle = artSubmissionInfo.artTitle.trim();
    // checking art description
    if (!artSubmissionInfo.artDescription) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a description for your art",
      });
      return;
    }
    if (typeof artSubmissionInfo.artDescription !== "string") {
      res.status(400).render("../views/pages/create", {
        error: "Description must be a string",
      });
      return;
    }
    if (artSubmissionInfo.artDescription.trim().length === 0) {
      res.status(400).render("../views/pages/create", {
        error:
          "Description cannot be an empty string or string with just spaces",
      });
      return;
    }
    artSubmissionInfo.artDescription = artSubmissionInfo.artDescription.trim();

    //checking forSale and setPrice
    if (!artSubmissionInfo.forSale) {
      if (!artSubmissionInfo.setPrice) {
        res.status(400).render("../views/pages/create", {
          error: "Must provide a price",
        });
        return;
      }
      if (typeof artSubmissionInfo.setPrice !== "number") {
        res.status(400).render("../views/pages/create", {
          error: "Price must be a number",
        });
        return;
      }
      if (artSubmissionInfo.setPrice < 0) {
        res.status(400).render("../views/pages/create", {
          error: "Price cannot be negative",
        });
        return;
      }
      if (artSubmissionInfo.setPrice != artSubmissionInfo.setPrice.toFixed(2)) {
        res.status(400).render("../views/pages/create", {
          error: "Price must have 0-2 decimal places",
        });
        return;
      }
    }

    // checking rating
    if (artSubmissionInfo.artRating == null) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a rating for your art",
      });
      return;
    }
    if (typeof artSubmissionInfo.artRating != "number") {
      res.status(400).render("../views/pages/create", {
        error: "Rating must be a number",
      });
      return;
    }
    if (artSubmissionInfo.artRating < 0 || artSubmissionInfo.artRating > 5) {
      res.status(400).render("../views/pages/create", {
        error: "artRating has to be between 0 and 5.",
      });
      return;
    }
    if (artSubmissionInfo.artRating != artSubmissionInfo.artRating.toFixed(1)) {
      res.status(400).render("../views/pages/create", {
        error: "artRating must have 0 or 1 decimal places.",
      });
      return;
    }

    // checking genre

    if (!artSubmissionInfo.typeGenre) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a genre for your art",
      });
      return;
    }
    if (typeof artSubmissionInfo.typeGenre !== "string") {
      res.status(400).render("../views/pages/create", {
        error: "Genre must be a string",
      });
      return;
    }
    if (artSubmissionInfo.typeGenre.trim().length === 0) {
      res.status(400).render("../views/pages/create", {
        error: "Genre cannot be an empty string or string with just spaces",
      });
      return;
    }
    artSubmissionInfo.typeGenre = artSubmissionInfo.typeGenre.trim();

    const result = await cloudinary.uploader.upload(req.file.path);

    const newArtSubmission = await artItemApi.createArtItem(
      req.session.userId,
      artSubmissionInfo.artTitle,
      artSubmissionInfo.artDescription,
      artSubmissionInfo.forSale,
      artSubmissionInfo.setPrice,
      0,
      artSubmissionInfo.typeGenre,
      result.secure_url,
      result.public_id
    );
    //console.log(newArtSubmission);
    res.status(200).redirect("/item/" + newArtSubmission._id);
  } catch (e) {
    //console.log("hi");
    //console.log(e);
    res.status(400).render("../views/pages/error", { error: e });
  }
});
router.post("/rateArt", async (req, res) => {
  try {
    let newRating = req.body.rating;
    let artId = req.body.artId;
    //todo: get item id from form
    console.log(artId);
    console.log(newRating);
    let update = await artItemApi.updateRating(newRating, artId);
  } catch (e) {
    res.json(e);
  }
});
module.exports = router;
