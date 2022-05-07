const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

let exportedMethods = {
	async getUser(userId) {
		if (!userId) throw "Must provide a user id";
		try {
			let userCollection = await users();
			let user = await userCollection.find({ _id: userId });
			console.log("user", user);
			return user;
		} catch (e) {
			throw e;
		}
	},
	async createUser(userName, password, firstName, lastName, email, dob) {
		const userCollection = await users();

		// ---------------- checks if instances are here. -------------
		if (!userName) throw "Username is not supplied.";
		if (!firstName) throw "First Name is not supplied.";
		if (!lastName) throw "Last Name is not supplied.";
		if (!password) throw "Password is not supplied.";
		if (!email) throw "Email is not supplied.";
		if (!dob) throw "Date of Birth is not supplied.";

		// -------------- checks if all strings are not empty ---------
		if (firstName.trim().length === 0)
			throw "First Name cannot just be empty spaces!";
		if (lastName.trim().length === 0)
			throw "Last Name cannot just be empty spaces!";
		if (password.trim().length === 0)
			throw "Password cannot just be empty spaces!";
		if (email.trim().length === 0)
			throw "Email URL cannot just be empty spaces!";

		// ------------- checks if strings have unwanted characters --------
		var regEx = /^[0-9a-zA-Z]+$/;
		if (!userName.match(regEx))
			throw "Username must only contain alphanumeric characters!";
		if (!firstName.match(regEx))
			throw "First Name must only contain alphanumeric characters!";
		if (!lastName.match(regEx))
			throw "Last Name must only contain alphanumeric characters!";

		// ------------- checks if length of strings are enough ------------
		if (userName.length < 3)
			throw "Username must be at least 3 characters long.";
		if (firstName.length < 3)
			throw "First Name must be at least 3 characters long.";
		if (lastName.length < 3)
			throw "Last Name must be at least 3 characters long.";
		if (password.length < 8)
			throw "Password must be at least 8 characters long.";
		if (email.length < 8) throw "Email must be at least 8 characters long.";

		// -------------- checks if username already exist -----------------
		let usernameCheck = userName.toLowerCase();
		const dupeCheck = await userCollection.findOne({ username: usernameCheck });
		if (dupeCheck) throw "This username already exists! Try another one.";

		// -------------- get the date they created the account ------------------
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0");
		var yyyy = today.getFullYear();

		today = mm + "/" + dd + "/" + yyyy;

		// --------------- inserting user's information into database --------
		let hashedPassword = await bcrypt.hash(password, 16);
		let userInserted = {
			userName: userName.toLowerCase(),
			firstName: firstName,
			lastName: lastName,
			hashedPassword: hashedPassword,
			userEmail: email,
			userDob: dob,
			dateJoined: today,
			ownedArt: [],
			userPurchases: [],
		};

		const newInsertInformation = await userCollection.insertOne(userInserted);
		if (!newInsertInformation.insertedId) throw "Insert failed!";

		return await { userInserted: true };
	},
	async checkUser(username, password) {
		const userCollection = await users();

		// ---------------- error checking -------------
		if (!username) throw "Username must be supplied!";
		if (!password) throw "Password must be supplied!";

		if (username.trim().length === 0)
			throw "Username cannot just be empty spaces!";
		if (password.trim().length === 0)
			throw "Password cannot just be empty spaces!";

		if (username.length < 3)
			throw "Username must be at least 3 characters long.";
		if (password.length < 8)
			throw "Password must be at least 8 characters long.";

		for (x of username) {
			if (x === " ") throw "Username cannot have spaces!";
		}
		for (x of password) {
			if (x === " ") throw "Password cannot have spaces!";
		}

		var regEx = /^[0-9a-zA-Z]+$/;
		if (!username.match(regEx))
			throw "Username must only contain alphanumeric characters!";

		// --------- finding user ----------
		let usernameLower = username.toLowerCase();

		let userToCheck = await userCollection.findOne({ userName: usernameLower });
		if (!userToCheck) throw "Either the username or password is invalid";

		// ---------- authenticating -----------
		let checkPassword = await bcrypt.compare(
			password,
			userToCheck.hashedPassword
		);
		let id = userToCheck._id;
		id = ObjectId(id);
		if (checkPassword) return { authenticated: true, userId: id };

		throw "Either the username or password is invalid";
	},

	async resetPassword(username, password) {
		const userCollection = await users();

		// ---------------- error checking -------------
		if (!username) throw "Username must be supplied!";
		if (!password) throw "Password must be supplied!";

		if (username.trim().length === 0)
			throw "Username cannot just be empty spaces!";
		if (password.trim().length === 0)
			throw "Password cannot just be empty spaces!";

		if (username.length < 3)
			throw "Username must be at least 3 characters long.";
		if (password.length < 8)
			throw "Password must be at least 8 characters long.";

		for (x of username) {
			if (x === " ") throw "Username cannot have spaces!";
		}
		for (x of password) {
			if (x === " ") throw "Password cannot have spaces!";
		}

		var regEx = /^[0-9a-zA-Z]+$/;
		if (!username.match(regEx))
			throw "Username must only contain alphanumeric characters!";

		// --------- finding user ----------
		let usernameLower = username.toLowerCase();

		let userToCheck = await userCollection.findOne({ username: usernameLower });
		if (!userToCheck) throw "Could not find this username. Please try another!";

		let hashPass = await bcrypt.hash(password, 16);

		userCollection.updateOne(
			{ username: usernameLower },
			{
				$set: {
					password: hashPass,
				},
			}
		);
		return await { passwordUpdated: true };
	},
	async getUserBySearch(userSearched) {
		if (!userSearched) throw "Search term is not provided.";

		const userCollection = await users();
		let allUsers = await userCollection.find({}).toArray();

		let usersFound = [];
		for (x of allUsers) {
			if (userSearched === x.userName) {
				usersFound.push(x);
			}
		}

		return usersFound;
	},
};

module.exports = exportedMethods;
