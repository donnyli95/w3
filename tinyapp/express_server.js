// express server setup
const express = require("express");
const app = express();
const PORT = 8080;

// ejs import
app.set("view engine", "ejs");

// body parser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// cookie parser middleware
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// import helper functions
const { generateRandomString } = require("./helperFunctions");
const { emailExists } = require("./helperFunctions");
const { passwordMatch } = require("./helperFunctions");
const { getID } = require("./helperFunctions");
const { urlsForUser } = require("./helperFunctions");

// import data
const { urlDatabase } = require('./data');
const { users } = require('./data');

// Server listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//Convert to json?? not sure what this does... 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Default page, should redirect to something?
app.get("/", (req, res) => {
  res.send("Hello!");
}); 

// Shows list of urls
app.get("/urls", (req, res) => {
  if (Object.keys(req.cookies).length !== 0) {
    const templateVars = {
      urls: urlsForUser(req.cookies["user_id"], urlDatabase),
      serverCookies: req.cookies,
      displayName: users[req.cookies["user_id"]].email
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

//Create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    serverCookies: req.cookies,
    displayName: users[req.cookies["user_id"]].email
  };

  if (Object.keys(req.cookies).length !== 0) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Shows specific URL information
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    serverCookies: req.cookies,
    displayName: users[req.cookies["user_id"]].email
  };
  res.render("urls_show", templateVars);
});

// Adding more urls
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }

  res.redirect("/urls");
});

//Redirect to actual url link when clicked 
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// Delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.cookies["user_id"]) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});

// Edit button
app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.cookies["user_id"]) {
    let shortURL = req.params.shortURL;
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect("/urls");
  }
});

// Header buttons
app.post("/registerHeader", (req, res) => {
  res.redirect("/register");
});

app.post("/loginHeader", (req, res) => {
  res.redirect("/login");
});

// Register functions
app.get("/register", (req, res) => {
  const templateVars = {
    serverCookies: req.cookies
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let randomID = generateRandomString();

  if (req.body.email.length === 0 || req.body.psw.length === 0) {
    res.status(400);
    console.log(res.statusCode);
    res.redirect("/register");
  } else if (emailExists(req.body.email, users)) {
    res.status(400);
    console.log(res.statusCode);
    res.redirect("/login");
  } else {
    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: req.body.psw
    };
    res.cookie("user_id", randomID);
    res.redirect("/urls");
  }

});

//Login functions
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    serverCookies: req.cookies
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {

  if (!emailExists(req.body.email, users)) {
    res.status(403);
    console.log(res.statusCode);
    res.redirect("/login");
  } else if (!passwordMatch(req.body.email, req.body.psw, users)) {
    res.status(403);
    console.log(res.statusCode);
    res.redirect("/login");
  } else {
    res.cookie("user_id", getID(req.body.email, req.body.psw, users));
    res.redirect("/urls");
  }
});

//Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
