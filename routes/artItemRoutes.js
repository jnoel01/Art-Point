const express = require("express");
const session = require("express-session");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const artItemApi = require("../data/artItem");

const { ObjectId } = require("mongodb");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const xss = require('xss');
router.get("/:id", async (req, res) => {
  let artId = req.params.id;
  try {
    let art = await artItemApi.getArtItemById(artId);
    let artist = await userData.getUser(ObjectId(art.userId));
    if (!art.artTitle) {
      throw "Art Title not found for item"
    }
    
    if (!art.artDescription) {
      throw "Art Description not found for item"
    }
    if (!art.imageSource) {
      throw "Image source not found for item"
    }
    if (!artist.userName) {
      throw "Artist not found for item"
    }
    if (!art.userId) {
      throw "Artist ID not found for item"
    }
    // if (!art.artRating) {
    //   throw "Art Rating not found for item"
    // }
    // if (!art.numRatings) {
    //   throw "Number of ratings not found for item"
    // }
    if (!art._id) {
      throw "Art ID not found for item"
    }
    if (!art.typeGenre) {
      throw "Art Genre not found for item"
    }
    if (!art.artComments) {
      throw "Art Comments not found for item"
    }
    if (!art.timeUploaded) {
      throw "No upload time for item"
    }

    req.session.artId = art._id;
    //console.log("art id is" + art._id);
    res.render("../views/pages/artItem", {
      artTitle: art.artTitle,
      artDescription: art.artDescription,
      imageSource: art.imageSource,
      artistName: artist.userName,
      artistId: art.userId,
      artRating: art.artRating,
      numRatings: art.numRatings,
      purchased: art.purchased,
      artId: art._id,
      typeGenre: art.typeGenre,
      forSale: art.forSale,
      setPrice: art.setPrice,
      purchasePage: "/purchaseItem",
      comments: art.artComments,
      loggedInUser: req.session.userId,
      timeUploaded:art.timeUploaded
    });
  } catch (e) {
    res.render("../views/pages/error", { error: e });
  }
});

router.post("/submitart", upload.single("image"), async (req, res) => {
  try {
    let artSubmissionInfo = req.body;
    // checking art title
    if (!artSubmissionInfo.artTitle) {
      res.status(400).render("../views/pages/create", {
        error: "You must provide a title for your art",
      });
      return;
    }
    if (typeof artSubmissionInfo.artTitle !== "string") {
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
    if (artSubmissionInfo.forSale === "on") {
      artSubmissionInfo.setPrice = parseFloat(artSubmissionInfo.setPrice);
      artSubmissionInfo.setPrice = artSubmissionInfo.setPrice.toFixed(2);
      artSubmissionInfo.setPrice = parseFloat(artSubmissionInfo.setPrice);
      artSubmissionInfo.setPrice = parseFloat(artSubmissionInfo.setPrice);
      // convert input to float
      console.log(artSubmissionInfo.setPrice);
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
      // if ((artSubmissionInfo.setPrice !== artSubmissionInfo.setPrice.toFixed(2)) || (artSubmissionInfo.setPrice !== artSubmissionInfo.setPrice.toFixed())) {
      // 	res.status(400).render("../views/pages/create", {
      // 		error: "Price must have 0 or 2 decimal places",
      // 	});
      // 	return;
      // }
    }
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
      xss(req.session.userId),
      xss(artSubmissionInfo.artTitle),
      xss(artSubmissionInfo.artDescription),
      xss(artSubmissionInfo.forSale),
      xss(artSubmissionInfo.setPrice),
      0,
      xss(artSubmissionInfo.typeGenre),
      result.secure_url,
      result.public_id,
    );
    res.status(200).redirect("/item/" + newArtSubmission._id);
  } catch (e) {
    res.status(400).render("../views/pages/error", { error: e });
  }
});
router.post("/rateArt", async (req, res) => {
  try {
    let newRating = xss(req.body.rating);
    let artId = xss(req.body.artId);
   
    const update = await artItemApi.updateRating(artId, newRating);
    res.redirect(`/item/${artId}`);
  } catch (e) {
    res.json(e);
  }
});
router.post("/comment", async (req, res) => {
  try {
    let comment = xss(req.body.comment);
    let artId = req.body.artId;
    let userId = req.body.userId;
    console.log("comment", comment);
    console.log("id:", artId);
    console.log("userId", userId);
    let newComment = await artItemApi.addComment(artId, userId, comment);
    console.log(newComment);
    res.redirect(`/item/${artId}`);
  } catch (e) {
    res.json(e);
  }
});
module.exports = router;
