//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB", { useNewURLParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// const secret = "";
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = mongoose.model("User", userSchema);

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser
      .save()
      .then(function (userSave) {
        res.render("secrets");
      })
      .catch(function (err) {
        console.log(err);
      });
  });
});

app.post("/login", (req, res) => {
  //find the user in database using username and check if it matches with entered passsword
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then(function (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        // result == true
        if (result == true) {
          res.render("secrets");
        } else {
          res.send("Don't be smart");
        }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});
