//setup server
const express = require('express');
const app = express();
const PORT = 8080;
//require cookie session
const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['totallysecretkey']
}))

//requires
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const { get, redirect, cookie } = require('express/lib/response');
const morganMiddleware = morgan('dev')
app.use(morganMiddleware)
app.use(express.urlencoded({ extended: false }))

//helper functions 
const { generateRandomString, getUserById, urlsForUser, getUserByEmail } = require('./helper');

//set view engine
app.set('view engine', 'ejs');

// global objects
const urlDatabase = {
    b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
    }
};

const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "boom-boom"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "boomTown"
    }
}

//Gets//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

//redirect to login
app.get('/', (req, res) => {
    res.redirect('/login')
});

//login Page
app.get('/login', (req, res) => {
    if (!req.session.userid) {
        return res.render('urls_login')
    }
    res.redirect('/urls');
});

//register 
app.get('/register', (req, res) => {
    templateVars = {
        user: req.session.userid
    };
    res.render("urls_register", templateVars);
});

//urls
app.get("/urls", (req, res) => {
    const userID = req.session.userid;
    console.log('req.session', req.session);
    const urlsForUserDB = urlsForUser(userID, urlDatabase);
    const user = getUserById(userID, users); 

    if (!user) {
        return res.redirect("/login");
    } else {
        const templateVars = {
            urls: urlsForUserDB,
            user: user,
        };
        return res.render("urls_index", templateVars);
    }
});

//new url
app.get("/urls/new", (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login')
    }
    res.render("urls_new");
});

app.get('/urls/:shortURL', (req, res) => {
    const templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL
    };
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);

});
//POSTS-------------------------------------------------------------------------------------------------------------------------------------------------------------------

//register
app.post('/register', (req, res) => {
    if (req.body.email && req.body.password) {

        if (!getUserByEmail(req.body.email, users)) {
            const userID = generateRandomString(4);
            console.log('userID', userID)
            users[userID] = {
                id: userID,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10)
            };
        
        ;
        res.redirect('/login');
        }
    }
});

//login
app.post('/login', (req, res) => {
    const user = getUserByEmail(req.body.email, users)
    console.log('user:', user);
    const password = req.body.password;
    if (!user) {
        return res.status(401).send('Not registered, please follow registration link');
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('email or password is incorrect')
    }
    req.session.userid = user.id;
    res.redirect('/urls')   
})

//urls
app.post('/urls', (req, res) => {
    const longURL = req.body.longURL
    const shortURL = generateRandomString(6);
    const userID = req.session.userid
    urlDatabase[shortURL] = {
        longURL: longURL,
        userID: userID
    }
    res.redirect(`/urls/${shortURL}`);
});

//add logout
app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/login');
});

//delete
app.post('/urls/:shortURL/delete', (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls')
});

//edit
app.post('/urls/:shortURL/edit', (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls/new')
});

//Server Lsitening on Port
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
