const { users } = require('./data.js');

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
  for (randomID in object) {
    emailArray.push(object[randomID].email);
  }

  if (emailArray.includes(string)) {
    return true;
  } else {
    return false;
  }
}


module.exports = { generateRandomString, emailExists };