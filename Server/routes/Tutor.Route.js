const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

//model import
const { TutorModel } = require("../models/Tutor.model");

//middleware import
const { isAdminAuthenticated } = require("../middlewares/authenticate");
const { envFile } = require("../configs/env.config");

//get all tutor data
router.get("/all", async (req, res) => {
  try {
    const tutors = await TutorModel.find();
    res.send({ message: "All tutor data", tutors });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

//register new tutor
router.post("/register", isAdminAuthenticated, async (req, res) => {
  const { name, email, password, subject } = req.body.data;

  try {
    // Check if user already exists
    const user = await TutorModel.find({ email });
    if (user.length > 0) {
      return res.status(400).json({ msg: "User already registered" });
    }

    // Hash the password
    const secure_password = await bcrypt.hash(password, +envFile.SALT_ROUNDS);

    // Create and save the new tutor
    const tutor = new TutorModel({
      name,
      email,
      subject,
      password: secure_password,
    });
    await tutor.save();

    // Fetch the newly created tutor
    const newTutor = await TutorModel.findOne({ email });
    
    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: envFile.EMAIL_USER, // Use environment variable
        pass: envFile.EMAIL_PASS, // Use environment variable
      },
    });
    

    const mailOptions = {
      from: envFile.EMAIL_USER,
      to: email,
      subject: "Account ID and Password",
      text: `Welcome to LMS, Congratulations! Your account has been created successfully. User Type: Tutor, Password: ${password}`,
    };

    // Send email and handle response
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email error:", error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    // Send success response
    return res.status(201).json({
      msg: "Tutor Registered Successfully",
      tutor: newTutor,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ msg: "Tutor Registration failed" });
  }
});

//tutor login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const tutor = await TutorModel.find({ email });
    if (tutor.length > 0) {
      if (tutor[0].access == "false") {
        return res.send({ message: "Access Denied" });
      }
      bcrypt.compare(password, tutor[0].password, (err, results) => {
        if (results) {
          let token = jwt.sign(
            { email, name: tutor[0].name },
            envFile.JWT_SECRET,
            { expiresIn: "7d" }
          );
          res.send({
            message: "Login Successful",
            user: tutor[0],
            token,
          });
        } else {
          res.status(201).send({ message: "Wrong credentials" });
        }
      });
    } else {
      res.send({ message: "Wrong credentials" });
    }
  } catch (error) {
    res.status(404).send({ message: "Error" });
  }
});

//edit tutor
router.patch("/:tutorId", isAdminAuthenticated, async (req, res) => {
  const { tutorId } = req.params;
  const payload = req.body.data;
  try {
    const tutor = await TutorModel.findByIdAndUpdate({ _id: tutorId }, payload);
    const updatedTutor = await TutorModel.find({ _id: tutorId });
    res.status(200).send({ msg: "Updated Tutor", tutor: updatedTutor[0] });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete tutor
router.delete("/:tutorId", async (req, res) => {
  const { tutorId } = req.params;
  try {
    const tutor = await TutorModel.findByIdAndDelete({ _id: tutorId });
    res.status(200).send({ msg: "Deleted Tutor" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
