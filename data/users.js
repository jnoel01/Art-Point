const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {ObjectId} = require('mongodb');

let exportedMethods = {
    async createUser(username, password){
        const userCollection = await users();

        if(!username){
            throw "Username must be supplied!";
        }
        if(!password){
            throw "Password must be supplied!";
        }
        if(username.trim().length === 0){
            throw "Username cannot just be empty spaces!";
        }
        for(x of username){
            if(x === " "){
                throw "Username cannot have spaces!";
            }
        }
        var regEx = /^[0-9a-zA-Z]+$/; //checking for alphanumeric only. got regex from w3schools!
        if(!username.match(regEx)){
            throw "Username must only contain alphanumeric characters!";
        }
        if(username.length < 4){
            throw "Username must be at least 6 characters long.";
        }
        let usernameCheck = username.toLowerCase();
        const dupeCheck = await userCollection.findOne({username: usernameCheck});
        if(dupeCheck){
            throw "This username already exists! Try another one.";
        }
        if(password.trim().length === 0){
            throw "Password cannot just be empty spaces!";
        }
        for(x of password){
            if(x === " "){
                throw "Password cannot have spaces!";
            }
        }
        if(password.length < 6){
            throw "Password must be at least 6 characters long.";
        }

        let userInserted = {
            username: username.toLowerCase(),
            password: password
        };

        let hashPass = await bcrypt.hash(userInserted.password, saltRounds);
        
        userInserted.password = hashPass;

        const newInsertInformation = await userCollection.insertOne(userInserted);
        if(!newInsertInformation.insertedId){
            throw "Insert failed!";
        }
        return await {userInserted: true};

    },
    async checkUser(username, password){
        const userCollection = await users();

        if(!username){
            throw "Username must be supplied!";
        }
        if(!password){
            throw "Password must be supplied!";
        }
        if(username.trim().length === 0){
            throw "Username cannot just be empty spaces!";
        }
        for(x of username){
            if(x === " "){
                throw "Username cannot have spaces!";
            }
        }
        var regEx = /^[0-9a-zA-Z]+$/; //checking for alphanumeric only. got regex from w3schools!
        if(!username.match(regEx)){
            throw "Username must only contain alphanumeric characters!";
        }
        if(username.length < 4){
            throw "Username must be at least 6 characters long.";
        }
        if(password.trim().length === 0){
            throw "Password cannot just be empty spaces!";
        }
        for(x of password){
            if(x === " "){
                throw "Password cannot have spaces!";
            }
        }
        if(password.length < 6){
            throw "Password must be at least 6 characters long.";
        }

        let usernameLower = username.toLowerCase();

        let userToCheck = await userCollection.findOne({username: usernameLower});
        if(!userToCheck){
            throw "Either the username or password is invalid";
        }
        
        let checkPassword = await bcrypt.compare(password, userToCheck.password);

        if(checkPassword){
            return {authenticated: true}
        }
        else{
            throw "Either the username or password is invalid";
        }
    }
};

module.exports = exportedMethods;