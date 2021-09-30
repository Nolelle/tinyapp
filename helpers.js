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
//fucntion to check if email already exists.
const findUserByEmail = (email, obj) => {
  for (const userId in obj) {
    const user = obj[userId];
    if (user.email === email) {
      return true;
    }
  }
  return false;
};

module.exports = { generateRandomString, findUserByEmail };
