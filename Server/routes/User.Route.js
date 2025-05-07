const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

//model import
const { UserModel } = require("../models/user.model");

//middleware import
const { envFile } = require("../configs/env.config");

//user registration route
router.post("/register", async (req, res) => {
  const { email, phoneNumber, name, surname, password } = req.body;
  try {
    let user = await UserModel.find({ email });
    if (user.length > 0) {
      return res.send({ msg: "User already registered" });
    }
    bcrypt.hash(password, +envFile.SALT_ROUNDS, async (err, secure_password) => {
      if (err) {
        console.log(err);
      } else {
        const newUser = new UserModel({
          email,
          phoneNumber,
          name,
          surname,
          password: secure_password,
        });
        await newUser.save();
        res.send({ msg: "User Registered Successfully", user: newUser });
      }
    });
  } catch (err) {
    res.status(404).send({ msg: "User Registration failed" });
  }
});

module.exports = router;
