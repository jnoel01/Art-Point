const express = require("express");
const session = require("express-session");
const res = require("express/lib/response");
const router = express.Router();
const data = require("../data");
const { ObjectId } = require("mongodb");
const { artItem } = require("../data");
const userData = data.users;
const artData = data.artItem;
router.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect("/account");
  } else {
    res.redirect("/home");
    return;
  }
});
router.get("/account", async (req, res) => {
  if (req.session.userId) {
    res.redirect(`/account/${req.session.userId}`);
  } else {
    res.redirect("/login");
  }
});
router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/account");
  } else {
    res.status(401).render("../views/pages/login");
  }
});

router.get("/signup", async (req, res) => {
  if (req.session.user) {
    res.redirect("/account");
  } else {
    res.status(401).render("../views/pages/signup");
  }
});

router.post("/signup", async (req, res) => {
  try {
    console.log("Attempting to sign up....");

    // ---------------- checks if instances are here. -------------
    if (!req.body.userName) throw "Username is not supplied.";
    if (!req.body.firstName) throw "First Name is not supplied.";
    if (!req.body.lastName) throw "Last Name is not supplied.";
    if (!req.body.password) throw "Password is not supplied.";
    if (!req.body.userEmail) throw "Email is not supplied.";
    if (!req.body.userDob) throw "Date of Birth is not supplied.";

    // -------------- checks if all strings are not empty ---------
    if (req.body.userName.trim().length === 0)
      throw "Username cannot just be empty spaces!";
    if (req.body.firstName.trim().length === 0)
      throw "First Name cannot just be empty spaces!";
    if (req.body.lastName.trim().length === 0)
      throw "Last Name cannot just be empty spaces!";
    if (req.body.password.trim().length === 0)
      throw "Password cannot just be empty spaces!";
    if (req.body.userEmail.trim().length === 0)
      throw "Email URL cannot just be empty spaces!";

    // ------------- checks if strings have unwanted characters --------
    var regEx = /^[0-9a-zA-Z]+$/;
    if (!req.body.userName.match(regEx))
      throw "Username must only contain alphanumeric characters!";
    if (!req.body.firstName.match(regEx))
      throw "First Name must only contain alphanumeric characters!";
    if (!req.body.lastName.match(regEx))
      throw "Last Name must only contain alphanumeric characters!";

    // ------------- checks if length of strings are enough ------------
    if (req.body.userName.length < 3)
      throw "Username must be at least 3 characters long.";
    if (req.body.firstName.length < 3)
      throw "First Name must be at least 3 characters long.";
    if (req.body.lastName.length < 3)
      throw "Last Name must be at least 3 characters long.";
    if (req.body.password.length < 8)
      throw "Password must be at least 8 characters long.";
    if (req.body.userEmail.length < 8)
      throw "Email must be at least 8 characters long.";

    // ------------- checks if passwords match ------------------------
    if (req.body.password !== req.body.password2)
      throw "Passwords do not match!";

    // --------------------- call create user from user data ------------
    const user = await userData.createUser(
      req.body.userName,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
      req.body.userEmail,
      req.body.userDob
    );

    if (user.userInserted) {
      req.session.user = user._id;
      res.redirect("/home");
    } else {
      res.status(500).json("Internal Server Error");
      return;
    }
  } catch (e) {
    res.status(400).render("../views/pages/signup", { error: e });
    console.log(e);
    return;
  }
});

router.post("/login", async (req, res) => {
  console.log("attempting to log in");
  try {
    if (!req.body.username) {
      throw "Username must be supplied!";
    }
    if (!req.body.password) {
      throw "Password must be supplied!";
    }
    if (req.body.username.trim().length === 0) {
      throw "Username cannot just be empty spaces!";
    }
    for (x of req.body.username) {
      if (x === " ") {
        throw "Username cannot have spaces!";
      }
    }
    var regEx = /^[0-9a-zA-Z]+$/; //checking for alphanumeric only. got regex from w3schools!
    if (!req.body.username.match(regEx)) {
      throw "Username must only contain alphanumeric characters!";
    }
    if (req.body.username.length < 4) {
      throw "Username must be at least 6 characters long.";
    }
    if (req.body.password.trim().length === 0) {
      throw "Password cannot just be empty spaces!";
    }
    for (x of req.body.password) {
      if (x === " ") {
        throw "Password cannot have spaces!";
      }
    }
    if (req.body.password.length < 6) {
      throw "Password must be at least 6 characters long.";
    }
    const checkUser = await userData.checkUser(
      req.body.username,
      req.body.password
    );
    if (checkUser.authenticated) {
      req.session.user = req.body.username;
      req.session.userId = checkUser.userId;
      res.redirect(`/account/${checkUser.userId}`);
    } else {
      throw "Your username / password is invalid!";
    }
  } catch (e) {
    console.log(e);
    res.status(400).render("../views/pages/login", { error: e });
    return;
  }
});

router.get("/account/:userId", async (req, res) => {
  if (req.session.user) {
    // console.log("req.session.user:", req.session.user)
    try {
      // console.log("id", req.session.userId)
      let userId = ObjectId(req.params.userId);
      let user = await userData.getUser(userId);
      let artItems = await artData.getArtByUser(req.params.userId);

      //loop through items and separate into two arrays: forSaleItems and notForSaleItems
      let forSaleItems = [];
      let notForSaleItems = [];
      //console.log(artItems);
      for (let i = 0; i < artItems.length; i++) {
        if (artItems[i].forSale) {
          forSaleItems.push(artItems[i]);
        } else {
          notForSaleItems.push(artItems[i]);
        }
      }
      res.render("../views/pages/account", {
        user: user,
        forSaleItems: forSaleItems,
        notForSaleItems: notForSaleItems,
      });
    } catch (e) {
      console.log(e);
      res.json(e);
      // res.status(400).render(`../account/${userId}`, { error: e });
      return;
    }
  } else {
    e = "Please login with a valid username and password!";
    res.status(401).render("../views/pages/login", { e });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("AuthCookie");
  res.render("../views/pages/homePage");
});

router.get("/passwordReset", async (req, res) => {
  if (req.session.user) {
    res.render("../views/pages/account", { username: req.session.user });
  } else {
    res.render("../views/pages/passwordReset");
  }
});

router.post("/passwordReset", async (req, res) => {
  try {
    if (!req.body.username) {
      throw "Username must be supplied!";
    }
    if (!req.body.password) {
      throw "Password must be supplied!";
    }
    if (req.body.username.trim().length === 0) {
      throw "Username cannot just be empty spaces!";
    }
    for (x of req.body.username) {
      if (x === " ") {
        throw "Username cannot have spaces!";
      }
    }
    var regEx = /^[0-9a-zA-Z]+$/; //checking for alphanumeric only. got regex from w3schools!
    if (!req.body.username.match(regEx)) {
      throw "Username must only contain alphanumeric characters!";
    }
    if (req.body.username.length < 4) {
      throw "Username must be at least 6 characters long.";
    }
    if (req.body.password.trim().length === 0) {
      throw "Password cannot just be empty spaces!";
    }
    for (x of req.body.password) {
      if (x === " ") {
        throw "Password cannot have spaces!";
      }
    }
    if (req.body.password.length < 6) {
      throw "Password must be at least 6 characters long.";
    }

    const updateUser = await userData.resetPassword(
      req.body.username,
      req.body.password
    );

    if (updateUser.passwordUpdated) {
      res.redirect("/login");
    } else {
      throw "Invalid username!";
    }
  } catch (e) {
    res.status(400).render("../views/pages/passwordReset", { error: e });
    return;
  }
});

router.get("/home", async (req, res) => {
  try {
    let artItems = await artData.getAllArtItems();
    artItems.reverse();
    //console.log(artItems);
    res.render("../views/pages/homePage", { artItems: artItems });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.post("/home", async (req, res) => {
  const searchTerm = req.body.userSearched;
  try {
    if (searchTerm.trim().length === 0) {
      res.render("../views/pages/searchResults", {
        username: searchTerm,
        error: "No users with that username.",
      });
      return;
    }
    const results = await userData.getUserBySearch(searchTerm);
    if (results.length > 0) {
      res.render("../views/pages/searchResults", {
        users: results,
        username: searchTerm,
      });
    } else {
      res.render("../views/pages/searchResults", {
        username: searchTerm,
        error: "No users with that username.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
    return;
  }
});

router.get("/create", async (req, res) => {
  if (req.session.user) {
    res.render("../views/pages/create");
  } else {
    res.status(401).render("../views/pages/login");
  }
});

router.get("/support", async (req, res) => {
  res.render("../views/pages/support");
});

router.get("/aboutUs", async (req, res) => {
  res.render("../views/pages/aboutUs");
});

router.get("/purchaseItem/:id", async (req, res) => {
  let artId = req.params.id;
  let artItem = await artData.getArtItemById(artId);
  res.render("../views/pages/purchaseItem", {
    title: artItem.artTitle,
    artist: artItem.artistName,
    id: artId,
  });
});

router.post("/purchased/:id", async (req, res) => {
  let artId = req.params.id;
  let artItem = await artData.getArtItemById(artId);
  await artData.purchaseArt(artId);
  res.render("../views/pages/purchaseSuccess", {
    title: artItem.artTitle,
    artist: artItem.artistName,
    imageSource: artItem.imageSource,
  });
});

module.exports = router;
