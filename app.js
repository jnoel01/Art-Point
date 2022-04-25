const express = require('express');
const app = express();
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
var exphbs = require('express-handlebars');
const session = require('express-session');
const connection = require ('./config/mongoConnection');
const {ConnectionCheckedInEvent} = require('mongodb');
const { parseWithoutProcessing } = require('handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
    name: 'AuthCookie',
    secret: 'supersecretshh',
    resave: false,
    saveUninitialized: true,
}));

app.use('/private', (req, res, next) => {
    console.log(req.session.id);
    if(!req.session.user){
        return res.status(403).redirect('/');
    } else{
        next();
    }
});

configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

