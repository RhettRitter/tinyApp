const express = require('express');
const app = express();
const PORT = 8080;

function generateRandomString(numOfChars) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < numOfChars; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const morgan = require('morgan')
const morganMiddleware = morgan('dev')
app.use(morganMiddleware)


app.set('view engine', 'ejs');

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/urls.json', (req, res) => {
    res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
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
app.get('/urls/:shortURL', (req, res) => {
        const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
    const shortURL = req.params.shortURL;
      delete urlDatabase[shortURL];
      res.redirect('/urls')
});
/*app.post("/urls", (req, res) => {
    //tinyURL = generateRandomString(6);
    console.log(req.body.longURL);
    
    urlDatabase[generateRandomString(6)] = req.body.longURL;
        res.redirect('/urls');
});*/




app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
