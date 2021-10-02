//returns a string of 6 random alphanumeric characters:
const generateRandomString = function () {
  const arr = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let i = 0;
  while (i <= 6) {
    const randomNum = Math.floor(Math.random() * characters.length);
    const nextLetter = characters.charAt(randomNum);
    arr.push(nextLetter);
    if (arr.length > 6) {
      return arr.join("");
    }
    i++;
  }
};

//returns the user object if email is found, otherwise return undefined.
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
