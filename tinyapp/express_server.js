// express server setup
const express = require("express");
const app = express();
const PORT = 8080;
// ejs import
app.set("view engine", "ejs");
// body parser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// cookie parser middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// import helper functions
const { generateRandomString } = require("./helperFunctions");
const { emailExists } = require("./helperFunctions");
// import data
const { urlDatabase } = require('./data');
const { users } = require('./data');


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    serverCookies: req.cookies
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    serverCookies: req.cookies
   }
  res.render("urls_show", templateVars)
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL
  res.redirect(`/urls/${shortURL}`);
});


app.post("/login", (req, res) => {
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    serverCookies: req.cookies
  };
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { 
    serverCookies: req.cookies
   }
  res.render("register", templateVars)
});

app.post("/register", (req, res) => {
  let randomID = generateRandomString();

  if (req.body.email.length === 0 || req.body.psw.length === 0) {
    res.status(400)
    res.redirect("/register")
  } else if (emailExists(req.body.email, users)) {
    res.status(400)
    res.redirect("/register")
  } else {
    users[randomID] = {
      id: randomID,
      email: req.body.email, // req.cookies.email??
      password: req.body.psw
    }
    res.cookie("user_id", req.body);
    res.redirect("/urls");
  }

});

app.post("/registerTest", (req, res) => {
  res.redirect("/register");
});

app.get("/login", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    serverCookies: req.cookies
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
});