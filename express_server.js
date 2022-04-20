const express = require('express');
const app = express();
const PORT = 8080;
//requires
const cookieParser = require('cookie-parser')
app.use(cookieParser());


const morgan = require('morgan');
const { get, redirect } = require('express/lib/response');
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
let urlDatabase = {

    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
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

//Gets//

//redirect to login
app.get('/', (req, res) => {
    res.redirect('/login');
});
//login Page
app.get('/login', (req, res) => {
    res.render('urls_login');
});




app.get("/urls", (req, res) => {
    const templateVars = {
        username: req.cookies["user"],
        urls: urlDatabase
    };
    res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.post('/urls', (req, res) => {
    const shortURL = generateRandomString(6);
    urlDatabase[shortURL] = req.body.longURL
    res.redirect(`/urls/${shortURL}`);

});
//addregistration page
app.get('/register', (req, res) => {
    templateVars = {
        user: req.cookies['userID']
    };
    res.render("urls_register", templateVars);
});
//add user object to global users object
app.post('/register', (req, res) => {
    const id = generateRandomString(4);

    const email = req.body.email;

    const password = req.body.password

    const user = {
        id: id,
        email: email,
        password: password

    };

    users[id] = user;
    console.log('users', users);

    res.redirect('/login')
});


app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
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
    if (foundUser.password !== password) {
        return res.status(401).send('wrong password')


    }
    res.cookie('userID', foundUser.ID)
    res.redirect('/urls')

})




app.post('/urls/:shortURL', (req, res) => {
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = req.body.updatedURL;
    res.redirect(`/urls`);

});
app.get('/urls/:shortURL', (req, res) => {
    const templateVars = {
        username: req.cookies["user"],
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL]
    };
    res.render("urls_show", templateVars);
});
//add logout
app.post("/logout", (req, res) => {
    res.clearCookie('UserId');
    res.redirect('/login')
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
