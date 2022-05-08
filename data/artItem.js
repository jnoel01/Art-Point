const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users; 
const userApi = require("./users");
const { ObjectId } = require("mongodb");
const { type, set } = require("express/lib/response");
const { artItems } = require("../config/mongoCollections");
const { artItem } = require(".");

let exportedMethods = {
	async createArtItem(
		userId,
		artTitle,
		artDescription,
		forSale,
		setPrice,
		artRating,
		typeGenre,
		imageSource,
		imageID
	) {
		// checking user id
		if (!userId) throw "You must provide a user ID to search for";
		if (typeof userId !== "string") throw "User ID must be a string";
		if (userId.trim().length === 0) {
			throw "User ID cannot be an empty string or just spaces";
		}
		userId = userId.trim();
		const user = await userApi.getUser(userId);
		console.log("user in createArt", user);
		// JACK 
		let artistName = user.userName;
		// checking art title
		if (!artTitle) throw "You must provide a title for your art";
		if (typeof artTitle !== "string") throw "Title must be a string";
		if (artTitle.trim().length === 0) {
			throw "Title cannot be an empty string or string with just spaces";
		}
		artTitle = artTitle.trim();
		// checking art description
		if (!artDescription) throw "You must provide a description for your art";
		if (typeof artDescription !== "string")
			throw "Description must be a string";
		if (artDescription.trim().length === 0) {
			throw "Description cannot be an empty string or string with just spaces";
		}
		artDescription = artDescription.trim();
		//checking forSale and setPrice
		let isForSale = false;
		if (forSale === "on") {
			//console.log(typeof setPrice);
			isForSale = true;
			if (!setPrice) throw "Must provide a price";
			setPrice = parseFloat(setPrice);
			if (typeof setPrice !== "number") throw "Price must be a number";
			if (setPrice < 0) throw "Price cannot be negative";
			if (setPrice != setPrice.toFixed(2))
				throw "Price must have 0-2 decimal places";
		} else {
			setPrice = null;
		}

		// checking rating
		//console.log(artRating);
		if (artRating == null) throw "You must provide a rating for your art";
		if (typeof artRating != "number") throw "Rating must be a number";
		if (artRating < 0 || artRating > 5) {
			throw "artRating has to be between 0 and 5.";
		}
		if (artRating != artRating.toFixed(1)) {
			throw "artRating must have 0 or 1 decimal places.";
		}

		// checking genre
		if (!typeGenre) throw "You must provide a genre for your art";
		if (typeof typeGenre !== "string") throw "Genre must be a string";
		if (typeGenre.trim().length === 0) {
			throw "Genre cannot be an empty string or string with just spaces";
		}
		typeGenre = typeGenre.trim();

		timeUploaded = new Date().toLocaleString();

		const artItemCollection = await artItems();

		let newArtItem = {
			userId: userId,
			artistName: artistName,
			artTitle: artTitle,
			artDescription: artDescription,
			forSale: isForSale,
			setPrice: setPrice,
			artRating: artRating,
			numRatings: 0,
			purchased: false,
			imageSource: imageSource,
			imageID: imageID,
			artComments: [],
			typeGenre: typeGenre,
		};
		const insertInfo = await artItemCollection.insertOne(newArtItem);
		if (!insertInfo.acknowledged || !insertInfo.insertedId)
			throw "Could not add art item";

		const newId = insertInfo.insertedId.toString();

		const artItem = await this.getArtItemById(newId);
		return artItem;
	},

	async getAllArtItems() {
		const artItemCollection = await artItems();
		const artItemList = await artItemCollection.find({}).toArray();
		if (!artItemList) throw "Could not get all art items";
		for (i in artItemList) {
			artItemList[i]._id = artItemList[i]._id.toString();
			
		}
		return artItemList;
	},

	async getArtItemById(id) {
		if (!id) throw "You must provide an id to search for";
		if (typeof id !== "string") throw "Id must be a string";
		if (id.trim().length === 0)
			throw "Id cannot be an empty string or just spaces";
		id = id.trim();
		if (!ObjectId.isValid(id)) throw "Invalid object ID";
		const artItemCollection = await artItems();
		const artItem = await artItemCollection.findOne({ _id: ObjectId(id) });
		if (artItem === null) throw "No art item with that id";
		artItem._id = artItem._id.toString();

		return artItem;
	},
	async getArtByUser(id) {
		if (!id) throw "You must provide an id to search for";
		if (typeof id !== "string") throw "Id must be a string";
		if (id.trim().length === 0)
			throw "Id cannot be an empty string or just spaces";
		id = id.trim();
		if (!ObjectId.isValid(id)) throw "Invalid object ID";
		const artCollection = await artItems();
		const userArtItems = await artCollection.find({ userId: id }).toArray();
		return userArtItems;
	},
	async purchaseArt(id){
		const artCollection = await artItems();
		artCollection.updateOne(
			{_id: ObjectId(id)},
			{ $set: { purchased: true, forSale: false},}
		)
	},
	async updateRating(id, rating) {
		// check art id
		if (!id) throw "You must provide an id to search for";
		if (typeof id !== "string") throw "Id must be a string";
		if (id.trim().length === 0)
			throw "Id cannot be an empty string or just spaces";
		id = id.trim();
		if (!ObjectId.isValid(id)) throw "Invalid object ID";
		// check rating
		rating = parseFloat(rating);
		if (!rating) throw "No rating provided";
		if (typeof rating !== "number") throw "rating must be a number";
		if (rating < 0 || rating > 5) throw "rating must be between 0 and 5";
		// getting art
		const artCollection = await artItems();
		const artItem = await artCollection.findOne({ _id: ObjectId(id) });
		console.log(artItem)
		// initializing variables
		let newAvgRating = 0; //new rating going into database
	
		
		let currentTotalRatings = artItem.artRating*artItem.numRatings;//total
		currentTotalRatings = currentTotalRatings + rating;//adding new
		newAvgRating = currentTotalRatings / (artItem.numRatings + 1);//dividing to get new average
		newAvgRating = newAvgRating.toFixed(3);
		const newArt = {
			artRating: newAvgRating,
			numRatings: artItem.numRatings + 1,
		}
		const insert = await artCollection.updateOne({_id: ObjectId(id)}, {$set: newArt})
		if (insert.modifiedCount === 0) throw "could  not update rating";
		return  newAvgRating
	},
	async addComment(artId, userId, comment){
			// check art id
			if (!artId) throw "You must provide an id to search for";
			if (typeof artId !== "string") throw "Id must be a string";
			if (artId.trim().length === 0)
				throw "Id cannot be an empty string or just spaces";
			artId = artId.trim();
			if (!ObjectId.isValid(artId)) throw "Invalid object ID";
			// check user id
			if (!userId) throw "You must provide an id to search for";
			if (typeof userId !== "string") throw "Id must be a string";
			if (userId.trim().length === 0)
				throw "Id cannot be an empty string or just spaces";
			userId = userId.trim();
			if (!ObjectId.isValid(userId)) throw "Invalid object ID";
			//check comment
			if (!comment) throw "you must provide a comment";
			if (typeof comment !== "string") throw "comment must be a string";
			if (comment.trim().length === 0) throw "comment cannot be empty spaces";
			comment = comment.trim();
			// get art
			console.log("INSIDE ADD COMMENT FUNCTION")
			const artItemCollection = await artItems();
			const artItem = await artItemCollection.findOne({ _id: ObjectId(id) });

			//get user
			const user = await userApi.getUser(ObjectId(userId));
			const newComment = {
				userId: user._id,
				userName: user.userName,
				message: comment
			}
			let tempComments = artItem.artComments;
			tempComments.push(newComment)
			console.log(tempComments)
			const newArt = {
				artComments: tempComments
			}

			const insert = await artCollection.updateOne({_id: ObjectId(id)}, {$set: newArt})
			if (insert.modifiedCount === 0) throw "could  not update rating";
			return  tempComments;
	}
};
module.exports = exportedMethods;
