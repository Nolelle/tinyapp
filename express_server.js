const express = require("express");
const morgan = require("morgan");
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const {
  generateRandomString,
  findUserByEmail,
  urlsForUser,
} = require("./helpers.js");

const app = express();
app.set("view engine", "ejs");

const users = {
  id1: {
    id: "id1",
    email: "123@123.com",
    password: bcrypt.hashSync("123", 10),
  },
  id2: {
    id: "id2",
    email: "1234@123.com",
    password: bcrypt.hashSync("1234", 10),
  },
};
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "id1",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "id1",
  },
  i3CoGr: {
    longURL: "https://www.nfl.com",
    userID: "id1",
  },
  o4LiGr: {
    longURL: "https://www.nhl.com",
    userID: "id2",
  },
};

//middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//get routes
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    return res.status(403).redirect("/error");
  }
  const urls = urlsForUser(userID, urlDatabase);
  const templateVars = {
    urls,
    user: users[userID],
    userID,
  };
  console.log(users);
  console.log(urlDatabase);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = {
    user: users[userID],
  };
  if (!userID) {
    res.redirect(`/login`);
    return;
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const userID = req.cookies.user_id;
  // const user = urlDatabase[shortURL];
  const templateVars = {
    user: users[userID],
    shortURL,
    longURL,
  };

  if (!userID) {
    return res.status(403).redirect("/error");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).redirect("/error");
  }

  // if (!urlDatabase[shortURL]) {
  //   res.status(404).redirect("/error");
  //   return;
  // }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  const shortURL = req.params.shortURL;
  const userID = req.cookies.user_id;
  if (!url) {
    return res.redirect("/notFound");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).redirect("/error");
  }
  const longURL = url.longURL;

  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = {
    user: users[userID],
  };
  res.render("register_form", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = {
    user: users[userID],
  };
  res.render("login", templateVars);
});

app.get("/error", (req, res) => {
  res.render("error");
});
app.get("/notFound", (req, res) => {
  res.render("notFound");
});

//posts routes
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  const userID = req.cookies.user_id;
  urlDatabase[shortURL] = { longURL, userID };
  if (!userID) {
    return res.status(403).redirect("/error");
  }
  res.redirect(`/urls/${shortURL}`);
});
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    return res.status(403).redirect("/error");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).redirect("/error");
  }

  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  let userID = req.cookies.user_id;
  if (!userID) {
    return res.status(403).redirect("/error");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).redirect("/error");
  }
  let shortURL = req.params.id;
  let user = urlDatabase[shortURL];
  user.longURL = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Please enter a email and a password");
  }
  const user = findUserByEmail(email, users);
  if (!user) {
    return res.status(400).send("Cannot find user email.");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).send("Password does not match");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();

  if (!email || !password) {
    return res.status(400).send("Please enter a email and a password");
  }

  const user = findUserByEmail(email, users);
  if (user) {
    return res.status(400).send("user with that email currently exists");
  }

  users[id] = {
    id,
    email,
    password: hashedPassword,
  };
  res.cookie("user_id", users.id);
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
