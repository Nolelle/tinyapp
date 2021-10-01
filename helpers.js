//returns a string of 6 random alphanumeric characters:
const generateRandomString = function () {
  let arr = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let i = 0;
  while (i <= 6) {
    let randomNum = Math.floor(Math.random() * characters.length);
    let nextLetter = characters.charAt(randomNum);
    arr.push(nextLetter);
    if (arr.length > 6) {
      return arr.join("");
    }
    i++;
  }
};
//Check if email exists in an object. (users)
const getUserByEmail = function (email, obj) {
  for (const userId in obj) {
    const user = obj[userId];
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
};

//returns an object of urls attached to the user
const urlsForUser = function (id, db) {
  const userURLs = {};
  for (let url in db) {
    const shortURL = db[url];
    if (id === shortURL.userID) {
      userURLs[url] = db[url];
    }
  }
  return userURLs;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
};
