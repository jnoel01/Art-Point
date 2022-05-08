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
		console.log(artId);
		console.log(newRating);
		let update = await artItemApi.updateRating(newRating, artId);
		console.log(update);
	} catch (e) {
		res.json(e);
	}
});
module.exports = router;
