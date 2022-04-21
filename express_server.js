const express = require('express');
const app = express();
const PORT = 8080;
//requires
const cookieParser = require('cookie-parser')
app.use(cookieParser());

const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const { get, redirect, cookie } = require('express/lib/response');
const morganMiddleware = morgan('dev')
app.use(morganMiddleware)
app.use(express.urlencoded({ extended: false }))

//helper functions 
function generateRandomString(numOfChars) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < numOfChars; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


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

let users = {
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
    if (!req.cookies['userId']) {
        return res.render('urls_login')
    }
    res.redirect('/urls');
});
//register 
app.get('/register', (req, res) => {
    templateVars = {
        user: req.cookies['userID']
    };
    res.render("urls_register", templateVars);
});
//urls
app.get("/urls", (req, res) => {
    if (!req.cookies['userId']) {
        return res.redirect('/login')
    }
    const templateVars = {
        user: req.cookies["userId"],
        urls: urlDatabase
    };
    res.render("urls_index", templateVars);
});
//new url
app.get("/urls/new", (req, res) => {
    if (!req.cookies['userId']) {
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
    console.log('short', shortURL)
    const longURL = urlDatabase[shortURL].longURL;
    console.log('long', longURL)
    res.redirect(longURL);

});
//POSTS-------------------------------------------------------------------------------------------------------------------------------------------------------------------

//register
app.post('/register', (req, res) => {
    const id = generateRandomString(4);

    const email = req.body.email;

    const password = req.body.password
    const hashedPassword = bcrypt.hashSync(password, 10)  

    const user = {
        id: id,
        email: email,
        password: hashedPassword

    };

    users[id] = user;
    //console.log('users', users);

    res.redirect('/login')
});

//login
app.post('/login', (req, res) => {
    
    const email = req.body.email;
    const password = req.body.password;
    //console.log(req.body.password)
    if (!email || !password) {
        return res.status(401).send('Not registered, please follow registration link');
    }


    let foundUser = null
    for (const userID in users) {
        const user = users[userID];
        //console.log('user:', user);
        if (user.email === email) {
            foundUser = user
            //console.log('userFound');
            break;
        }
    }
    if (!foundUser) {
        return res.status(403).send('no email on file')
    }
    //console.log(password)
    if (bcrypt.compareSync('password', foundUser.password)) {
        return res.status(401).send('wrong password')


    }
    res.cookie('userId', foundUser.id)
    res.redirect('/urls')
    //console.log('users password:', users.password);
    //console.log(req.body.password)
})
//urls

app.post('/urls', (req, res) => {
    const longURL = req.body.longURL
    const shortURL = generateRandomString(6);
    const userID = generateRandomString(4)
    urlDatabase[shortURL] = {
        longURL: longURL,
        userID: userID
    }
    //console.log('shortURL;', shortURL)
    res.redirect(`/urls/${shortURL}`);
});




//add logout/delete/edit
app.post("/logout", (req, res) => {
    //console.log('sounds good')
    res.clearCookie('userId');
    res.redirect('/login');
    //console.log(users)
});

app.post('/urls/:shortURL/delete', (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls')
});
app.post('/urls/:shortURL/edit', (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls/new')
});


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
