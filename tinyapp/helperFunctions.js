
//hashing password with bcrypt
const bcrypt = require('bcrypt');

const generateRandomString = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let maxNum = characters.length;
  for (let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * maxNum);
    result += characters[index];
  }

  return result;
};

const emailExists = (string, object) => {
  let emailArray = [];
  for (let randomID in object) {
    emailArray.push(object[randomID].email);
  }

  if (emailArray.includes(string)) {
    return true;
  } else {
    return false;
  }
};

const passwordMatch = (email, password, database) => {
  let emailArray = [];
  let passwordArray = [];
  for (let randomID in database) {
    emailArray.push(database[randomID].email);
    passwordArray.push(database[randomID].password);
  }

  let indicator;
  if (emailArray.includes(email)) {
    for (let index in email) {
      if (emailArray[index] === email) {
        indicator = index;
        break;
      }
    }
  }

  if (bcrypt.compareSync(password, passwordArray[indicator])) {
    return true;
  }

  return false;
};


const getID = (email, database) => {
  for (let objects in database) {
    if (database[objects].email === email) {
      return database[objects].id;
    }
  }
};

const urlsForUser = (id, database) => {
  let newURLS = [];
  for (let data in database) {
    if (database[data].userID === id) {
      newURLS[data] = {
        longURL:  database[data].longURL,
        userID: database[data].userID
      };
    }
  }
  return newURLS;
};

module.exports = { generateRandomString, emailExists, passwordMatch, getID, urlsForUser };

// test assertions
// const { users, urlDatabase } = require('./data.js');

// console.log(getID("user@example.com", "purple-monkey-dinosaur", users).id);
// console.log(urlsForUser("bunbun", urlDatabase).userID);