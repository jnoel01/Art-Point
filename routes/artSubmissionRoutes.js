const express = require("express");
const router = express.Router();
const data = require("../data");
const artItemData = data.artItem;
const { ObjectId } = require("mongodb");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const artItemApi = require("../data/artItem");

//post art item to db
router.post("/submitart", upload.single("image"), async (req, res) => {
  try {
    let artSubmissionInfo = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const newArtSubmission = await artItemData.createArtItem(
      //artSubmissionInfo.userId,
      artSubmissionInfo.artTitle,
      artSubmissionInfo.forSale,
      artSubmissionInfo.setPrice,
      artSubmissionInfo.artRating,
      artSubmissionInfo.typeGenre,
      result.secure_url,
      result.public_id
    );
    console.log(newArtSubmission);
    res.status(200).json(newArtSubmission);
  } catch (e) {
    console.log("hi");
    console.log(e);
    res.status(400).json({ error: e });
  }
});

module.exports = router;
