const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const { type, set } = require("express/lib/response");
const { artItems } = require("../config/mongoCollections");
const { artItem } = require(".");

let exportedMethods = {
  async createArtItem(
    userId,
    artTitle,
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

    // checking art title
    if (!artTitle) throw "You must provide a title for your art";
    if (typeof artTitle !== "string") throw "Title must be a string";
    if (artTitle.trim().length === 0) {
      throw "Title cannot be an empty string or string with just spaces";
    }
    artTitle = artTitle.trim();

    //checking forSale and setPrice
    if (forSale == "on") {
      //console.log(typeof setPrice);
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
      artTitle: artTitle,
      forSale: forSale,
      setPrice: setPrice,
      artRating: artRating,
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
};
module.exports = exportedMethods;
