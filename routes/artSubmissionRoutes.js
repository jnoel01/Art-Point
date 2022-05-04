const express = require("express");
const router = express.Router();
const data = require("../data");
const artItemData = data.artItem;
const { ObjectId } = require("mongodb");

//post art item to db
router.post("/submitart", async (req, res) => {
  let artSubmissionInfo = req.body;
  try {
    const newArtSubmission = await artItemData.createArtItem(
      //artSubmissionInfo.userId,
      artSubmissionInfo.artTitle,
      artSubmissionInfo.forSale,
      artSubmissionInfo.setPrice,
      artSubmissionInfo.artRating,
      artSubmissionInfo.typeGenre
    );
    res.status(200).json(newArtSubmission);
  } catch (e) {
    console.log("hi");
    console.log(e);
    res.status(400).json({ error: e });
  }
});

module.exports = router;
