#!/usr/bin/env nodejs
//setup our application

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8081;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

app.use(express.static('public'))

// configuration ===============================================================
exports.db = mongoose.connect(configDB.url); // connect to our database
db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);



var Hapi = require('hapi');
var Fitbit = require('fitbit-node');

var client = new Fitbit('22CK93', 'b696d195e374f8a183cbe550389c3a22');
var redirect_uri = "http://localhost:8080/auth/fitbit/callback";
var scope = "activity profile";

var server = new Hapi.Server();
server.connection({
    port: 8080
});

server.route([{
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply('Hello world from hapi');
        }
    },
    {
        method: 'GET',
        path: '/fitbit',
        handler: function(request, reply) {
            reply().redirect(client.getAuthorizeUrl(scope, redirect_uri));
        }
    },
    {
        method: 'GET',
        path: '/auth/fitbit/callback',
        handler: function(request, reply) {
            client.getAccessToken(request.query.code, redirect_uri).then(function(result) {
                client.get("/profile.json", result.access_token).then(function(profile) {
                    reply(profile);
                })
            })
        }
    }
]);

server.start(function(err) {
    console.log('Hapi is listening to http://localhost:8080');
});
