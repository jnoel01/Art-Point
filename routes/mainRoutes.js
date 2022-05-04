const express = require('express');
const session = require('express-session');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    if(req.session.user){
        res.redirect('/account');
    } else {
        res.status(401).render('../views/pages/homePage', {});
        return;
    }
});

router.get('/login', async (req, res) => {
    if(req.session.user){
        res.redirect('/account');
    } else {
        res.status(401).render('../views/pages/login')
    }
});

router.get('/signup', async (req, res) => {
    if(req.session.user){
        res.redirect('/account');
    } else {
        res.status(401).render('../views/pages/signup')
    }
});

router.post('/signup', async (req, res) => {
    try{
        if(!req.body.username){
            throw "Username must be supplied!";
        }
        if(!req.body.password){
            throw "Password must be supplied!";
        }
        if(req.body.username.trim().length === 0){
            throw "Username cannot just be empty spaces!";
        }
        for(x of req.body.username){
            if(x === " "){
                throw "Username cannot have spaces!";
            }
        }
        var regEx = /^[0-9a-zA-Z]+$/; //checking for alphanumeric only. got regex from w3schools!
        if(!req.body.username.match(regEx)){
            throw "Username must only contain alphanumeric characters!";
        }
        if(req.body.username.length < 4){
            throw "Username must be at least 6 characters long.";
        }
        if(req.body.password.trim().length === 0){
            throw "Password cannot just be empty spaces!";
        }
        for(x of req.body.password){
            if(x === " "){
                throw "Password cannot have spaces!";
            }
        }
        if(req.body.password.length < 6){
            throw "Password must be at least 6 characters long.";
        }
        const user = await userData.createUser(req.body.username, req.body.password);
        if(user.userInserted){
            res.redirect('/');
        } else{
            res.status(500).json("Internal Server Error");
            return;
        }
    } catch (e){
        res.status(400).render('../views/pages/signup', {error: e});
        return;
    }
});

router.post('/login', async (req, res) => {
    try{
        if(!req.body.username){
            throw "Username must be supplied!";
        }
        if(!req.body.password){
            throw "Password must be supplied!";
        }
        if(req.body.username.trim().length === 0){
            throw "Username cannot just be empty spaces!";
        }
        for(x of req.body.username){
            if(x === " "){
                throw "Username cannot have spaces!";
            }
        }
        var regEx = /^[0-9a-zA-Z]+$/; //checking for alphanumeric only. got regex from w3schools!
        if(!req.body.username.match(regEx)){
            throw "Username must only contain alphanumeric characters!";
        }
        if(req.body.username.length < 4){
            throw "Username must be at least 6 characters long.";
        }
        if(req.body.password.trim().length === 0){
            throw "Password cannot just be empty spaces!";
        }
        for(x of req.body.password){
            if(x === " "){
                throw "Password cannot have spaces!";
            }
        }
        if(req.body.password.length < 6){
            throw "Password must be at least 6 characters long.";
        }
        const checkUser = await userData.checkUser(req.body.username, req.body.password);
        if(checkUser.authenticated){
            req.session.user = req.body.username;
            res.redirect('/account');
        } else{
            throw "Your username / password is invalid!"
        }
    } catch (e){
        res.status(400).render('../views/pages/login', {error: e});
        return;
    }
});

router.get('/account', async (req, res) => {
    if(req.session.user){
        res.render('../views/pages/account', {username: req.session.user});
    } else{
        e = "Please login with a valid username and password!";
        res.status(401).render('../views/pages/login', { e });
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie('AuthCookie');
    res.render('../views/pages/homePage');
});

router.get('/passwordReset', async(req, res) => {
    if(req.session.user){
        res.render('../views/pages/account', {username: req.session.user});
    } else{
        res.render('../views/pages/passwordReset');
    }
});

router.post('/passwordReset', async(req, res) => {
    try{
        if(!req.body.username){
            throw "Username must be supplied!";
        }
        if(!req.body.password){
            throw "Password must be supplied!";
        }
        if(req.body.username.trim().length === 0){
            throw "Username cannot just be empty spaces!";
        }
        for(x of req.body.username){
            if(x === " "){
                throw "Username cannot have spaces!";
            }
        }
        var regEx = /^[0-9a-zA-Z]+$/; //checking for alphanumeric only. got regex from w3schools!
        if(!req.body.username.match(regEx)){
            throw "Username must only contain alphanumeric characters!";
        }
        if(req.body.username.length < 4){
            throw "Username must be at least 6 characters long.";
        }
        if(req.body.password.trim().length === 0){
            throw "Password cannot just be empty spaces!";
        }
        for(x of req.body.password){
            if(x === " "){
                throw "Password cannot have spaces!";
            }
        }
        if(req.body.password.length < 6){
            throw "Password must be at least 6 characters long.";
        }
        
        const updateUser = await userData.resetPassword(req.body.username, req.body.password);
        
        if(updateUser.passwordUpdated){
            res.redirect('/login');
        } else {
            throw "Invalid username!";
        }
    } catch (e) {
        res.status(400).render('../views/pages/passwordReset', {error: e});
        return;
    }
});

router.get('/home', async (req, res) => {
    res.render('../views/pages/homePage');
})
module.exports = router;