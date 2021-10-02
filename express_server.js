const express = require("express");
const morgan = require("morgan");
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
} = require("./helpers.js");

const app = express();
app.set("view engine", "ejs");

const users = {};

const urlDatabase = {};

//middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["user_id"],
  })
);

//start of get routes
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(403).redirect("/error");
  }

  const urls = urlsForUser(userID, urlDatabase);
  const templateVars = {
    urls,
    user: users[userID],
    userID,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
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
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(403).redirect("/error");
  }
  if (!urlDatabase[shortURL]) {
    res.status(404).redirect("/notFound");
    return;
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).redirect("/error");
  }
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    user: users[userID],
    shortURL,
    longURL,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];

  if (!url) {
    return res.redirect("/notFound");
  }
  const longURL = url.longURL;

  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: users[userID],
  };
  res.render("register_form", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    return res.redirect("/urls");
  }
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

//start of posts routes
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(403).redirect("/error");
  }
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(403).redirect("/error");
  }
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).redirect("/error");
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.id;
  const user = urlDatabase[shortURL];
  if (!userID) {
    return res.status(403).redirect("/error");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).redirect("/error");
  }

  user.longURL = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Please enter a email and a password");
  }
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(400).send("Cannot find user email.");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).send("Password does not match");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();

  if (!email || !password) {
    return res.status(400).send("Please enter a email and a password");
  }

  const user = getUserByEmail(email, users);
  if (user) {
    return res.status(400).send("user with that email currently exists");
  }

  users[id] = {
    id,
    email,
    password: hashedPassword,
  };

  req.session.user_id = id;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
