let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let passport = require('passport');
let LocalStrategy = require('passport-local');
let User = require('./models/user');
let Job = require('./models/job');

mongoose.connect("mongodb+srv://samueltent:1234567890@cluster0-cc3mv.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/src'));

app.use(require("express-session")({
    secret: "I did it",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   next();
});

app.get('/', (req, res) => {
    res.render("landing");
});

app.post('/', passport.authenticate("local", {
    successRedirect: '/index',
    failureRedirect: '/'}), (req, res) => {

});

app.get('/index', isLoggedIn ,  (req, res) => {
    // Job.create({
    //     title: "Culegator de prune",
    //     description: "Am nevoie de cineva sa imi culeaga prunele",
    //     retribution: {
    //         pay: 100,
    //         total: true
    //     },
    //     author: req.user
    // },
    //     (err, job) => {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         req.user.jobs.push(job);
    //     }
    // });
    res.render('index');
});


app.get('/register-user', (req, res) => {
    res.render('register-user');
});

app.post('/register-user', (req,res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
       if(err) {
           console.log(err);
           return res.render("register");
       } else {
            passport.authenticate("local")(req, res, () => {
               res.redirect("index");
            });
       }
    });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

app.listen(8080, process.env.IP, () => {
    console.log('server on');
});