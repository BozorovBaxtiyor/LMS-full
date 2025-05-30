const { envFile } = require("../configs/env.config");
const { AdminModel } = require("../models/admin.model");
const { TutorModel } = require("../models/Tutor.model");
const jwt = require("jsonwebtoken");

const isAdminAuthenticated = async (req, res, next) => {
  
  const token = req.body.token || req.headers['authorization']?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, envFile.JWT_SECRET);
    let user = await AdminModel.findOne({ email: decodedData.email });
    if (user) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const isSuperAdminAuthenticated = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, envFile.JWT_SECRET);
    let user = await AdminModel.findOne({ email: decodedData.email , userType: "SuperAdmin"});
    if (user) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const isTutorAuthenticated = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, envFile.JWT_SECRET);
    let tutor = await TutorModel.findOne({ email: decodedData.email });
    if (tutor) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const isAuthenticated = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, envFile.JWT_SECRET);
    let admin = await AdminModel.findOne({ email: decodedData.email });
    let tutor = await TutorModel.findOne({ email: decodedData.email });
    if (admin || tutor) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

module.exports = {
  isAdminAuthenticated,
  isTutorAuthenticated,
  isAuthenticated,
  isSuperAdminAuthenticated
};
