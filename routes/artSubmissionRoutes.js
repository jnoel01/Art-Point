const express = require("express");
const router = express.Router();
const data = require("../data");
const artItemData = data.artItem;
const { ObjectId } = require("mongodb");
const upload = require("../middleware/upload");

//post art item to db
router.post("/submitart", upload.single("file"), async (req, res) => {
	let artSubmissionInfo = req.body;
	if (req.file === undefined) return res.send("you must select a file.");
	const imgUrl = `http://localhost:3000/file/${req.file.filename}`;
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
