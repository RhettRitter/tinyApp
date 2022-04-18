const express = require('express');
const app = express();
const PORT = 8080;

function generateRandomString() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const characterlength =charactres.length;
    for ( let i = 0; i < 5 ; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characterlength));
    }
    return result;
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const morgan = require('morgan')
const morganMiddleware = morgan('dev')
app.use(morganMiddleware)


app.set('view engine', 'ejs');


const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.post('/urls', (req, res) => {
    console.log(req.body);
    res.send('ok')
})

app.get('/urls/new', (req, res) => {
    res.render('urls_new');
});

app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});

app.get('/', (req, res) => {
    res.send('hello');

});
app.get('/urls.json', (req, res) => {
    res.json(urlDatabase);
}); 

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
    res.render("urls_show", templateVars);
  });
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
