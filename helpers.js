//returns a string of 6 random alphanumeric characters:
function generateRandomString() {
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
}
//function to check if email exists in an object. (users)
const findUserByEmail = (email, obj) => {
  for (const userId in obj) {
    const user = obj[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

//function to check if password exists in an object. (users)
const findUserByPassword = (password, obj) => {
  for (const userId in obj) {
    const user = obj[userId];
    if (user.password === password) {
      return true;
    }
  }
  return false;
};

const findUserID = (email, obj) => {
  for (const userId in obj) {
    const user = obj[userId];
    if (user.email === email) {
      const userID = user.id;
      return userID;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  findUserByEmail,
  findUserByPassword,
  findUserID,
};
