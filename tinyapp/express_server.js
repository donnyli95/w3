// express server setup
const express = require("express");
const app = express();
const PORT = 8080;

// ejs import
app.set("view engine", "ejs");

// body parser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//replaced cookie-parser with cookie-session
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

//hashing password with bcrypt
const bcrypt = require('bcrypt');

// import data
const { urlDatabase } = require('./data');
const { users } = require('./data');

// import helper functions
const { generateRandomString } = require("./helperFunctions");
const { emailExists } = require("./helperFunctions");
const { passwordMatch } = require("./helperFunctions");
const { getID } = require("./helperFunctions");
const { urlsForUser } = require("./helperFunctions");

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
  if (Object.keys(req.session).length > 1) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// Shows list of urls
app.get("/urls", (req, res) => {
  if (Object.keys(req.session).length > 1) {
    const templateVars = {
      urls: urlsForUser(req.session["user_id"], urlDatabase),
      serverCookies: req.session,
      displayName: users[req.session["user_id"]].email
    };
    res.render("urls_index", templateVars);
  } else {
    const templateVars = {
      errorMessage: "PLease Log In First :)",
    }
    res.status(403).render("urls_index", templateVars);
  }
});

//Goes to new URL creation page
app.get("/urls/new", (req, res) => {
  if (Object.keys(req.session).length > 1) {
    const templateVars = {
      urls: urlDatabase,
      serverCookies: req.session,
      displayName: users[req.session["user_id"]].email
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Shows specific URL information
app.get("/urls/:shortURL", (req, res) => {
  let userArray = Object.keys(urlsForUser(req.session["user_id"], urlDatabase));

  if (Object.keys(req.session).length > 1 && userArray.includes(req.params.shortURL)) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      serverCookies: req.session,
      displayName: users[req.session["user_id"]].email
    };
    res.render("urls_show", templateVars);
  } else {
    const templateVars = {
      errorMessage: "Seriously, log in first!",
    }
    res.status(403).render("urls_show", templateVars);
  }
});

//Redirect to actual url link when clicked
app.get("/u/:shortURL", (req, res) => {
  if (Object.keys(req.session).length > 1) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    const templateVars = {
      errorMessage: "This is not yours",
    }
    res.status(403).render("errors", templateVars);
  }
});

// Adding more urls
app.post("/urls", (req, res) => {
  if (Object.keys(req.session).length > 1 && req.body.longURL.includes('http')) {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session["user_id"]
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    const templateVars = {
      errorMessage: "Did you include 'http'?",
    }
    res.status(403).render("errors", templateVars);
  }
});

//Update long URL of tiny URL
app.post("/urls/:shortURL", (req, res) => {
  if (req.session["user_id"] && req.body.newURL.includes('http')) {
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.newURL,
      userID: req.session["user_id"]
    };
    res.redirect(`/urls`);
  } else {
    const templateVars = {
      errorMessage: "This only works if you include 'http'",
    }
    res.status(403).render("errors", templateVars);
  }
});

// Delete URLs from list
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session["user_id"]) {
    delete urlDatabase[req.params.shortURL];
  }
  const templateVars = {
    errorMessage: "You can't delete what's not yours",
  }
  res.status(403).render("errors", templateVars);
});

// Redirects to Tiny URL info page
app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.session["user_id"]) {
    let shortURL = req.params.shortURL;
    res.redirect(`/urls/${shortURL}`);
  } else {
    const templateVars = {
      errorMessage: "You can't edit what's not yours",
    }
    res.status(403).render("errors", templateVars);
  }
});


// Header buttons/links
app.post("/registerHeader", (req, res) => {
  res.redirect("/register");
});

app.post("/loginHeader", (req, res) => {
  res.redirect("/login");
});

// Login Get Method
app.get("/login", (req, res) => {
  if (Object.keys(req.session).length > 1) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      urls: urlDatabase,
      serverCookies: req.session
    };
    res.render("login", templateVars);
  }

});

// Register Get Method
app.get("/register", (req, res) => {
  if (Object.keys(req.session).length > 1) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      serverCookies: req.session
    };
    res.render("register", templateVars);
  }

});

//Login Post Method
app.post("/login", (req, res) => {
  if (!emailExists(req.body.email, users)) {
    const templateVars = {
      errorMessage: "Please register first!",
    }
    res.status(404).render("errors", templateVars);
  } else if (!passwordMatch(req.body.email, req.body.psw, users)) {
    const templateVars = {
      errorMessage: "Wrong password :(",
    }
    res.status(404).render("errors", templateVars);
  } else {
    req.session["user_id"] = getID(req.body.email, users);
    res.redirect("/urls");
  }
});

//Register Post Method
app.post("/register", (req, res) => {
  let randomID = generateRandomString();

  if (req.body.email.length === 0 || req.body.psw.length === 0) {
    const templateVars = {
      errorMessage: "Please Fill Out Both Fields",
    }
    res.status(400).render("errors", templateVars);
  } else if (emailExists(req.body.email, users)) {
    const templateVars = {
      errorMessage: "You Already Have An Account",
    }
    res.status(400).render("errors", templateVars);
  } else {
    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.psw, 10)
    };
    req.session["user_id"] = randomID;
    res.redirect("/urls");
  }

});



//Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
