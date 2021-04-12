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

module.exports = generateRandomString;