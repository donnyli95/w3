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
// random string helper function
const generateRandomString = require("./randomString");
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
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
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
  res.cookie("username", req.body);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {

  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
   }
  res.render("register", templateVars)
});

app.post("/register", (req, res) => {
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.psw);
  let randomID = generateRandomString();
  users[randomID] = {
    id: randomID,
    email: req.cookies["email"],
    password: req.cookies["password"]
  }
  console.log(users[randomID]);
  res.redirect("/urls");
});

app.post("/registerTest", (req, res) => {
  res.redirect("/register");
});