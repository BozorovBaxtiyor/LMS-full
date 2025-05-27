const express = require("express");
const fs = require("fs");
const router = express.Router();
const { SubjectModel } = require("../models/subject.model");
const { isAdminAuthenticated } = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");
const { TutorModel } = require("../models/Tutor.model");

// Get all subjects - Public route
router.get("/all", async (req, res) => {
  try {
    const subjects = await SubjectModel.find();
    res.send({ message: "All subjects data", subjects });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong", error: error.message });
  }
});

// Get single subject - Public route
router.get("/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await SubjectModel.findById(subjectId);
    const tutor = await TutorModel.findById(subject.tutorId).select("name photoUrl");
    
    if (!subject) {
      return res.status(404).send({ message: "Subject not found" });
    }

    const subjectObj = subject.toObject();
    subjectObj.tutor = tutor;

    res.send({ message: "Subject found", subject: subjectObj });
  } catch (error) {
    res.status(400).send({ message: "Error fetching subject", error: error.message });
  }
});

// Create new subject - Admin only
router.post("/create", isAdminAuthenticated, upload.single('photo'), async (req, res) => {
  // O'chirilishi kerak bo'lgan rasm nomini saqlash uchun
  let uploadedFileName = null;

  try {
    const subjectData = req.body;
    
    // Add photo URL if image was uploaded
    if (req.file) {
      uploadedFileName = req.file.filename;
      subjectData.photoUrl = uploadedFileName;
    }
    // console.log(subjectData);
    
    // Convert string dates to Date objects
    if (subjectData.startDate) {
      subjectData.startDate = new Date(subjectData.startDate);
    }
    if (subjectData.endDate) {
      subjectData.endDate = new Date(subjectData.endDate);
    }

    const tutur = await TutorModel.findById(subjectData.tutorId);
    if (!tutur) {
      // Agar tutor topilmasa va rasm yuklangan bo'lsa, rasmni o'chiramiz
      if (uploadedFileName) {
        fs.unlink(`./uploads/images/${uploadedFileName}`, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }
      return res.status(404).send({ message: "Tutor not found" });
    }

    // Create and save new subject
    const subject = new SubjectModel(subjectData);
    await subject.save();

    res.status(201).send({ 
      message: "Subject created successfully", 
      subject 
    });
  } catch (error) {
    // Xatolik yuz berganda, agar rasm yuklangan bo'lsa uni o'chiramiz
    if (uploadedFileName) {
      fs.unlink(`./uploads/images/${uploadedFileName}`, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }
    
    res.status(400).send({ 
      message: "Error creating subject", 
      error: error.message 
    });
  }
});

// Update subject - Admin only
router.patch("/:subjectId", isAdminAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const { subjectId } = req.params;
    const updateData = req.body;

    // Add photo URL if new image was uploaded
    if (req.file) {
      updateData.photoUrl = req.file.filename;
    }

    // Convert string dates to Date objects if they exist
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const updatedSubject = await SubjectModel.findByIdAndUpdate(
      subjectId,
      updateData,
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).send({ message: "Subject not found" });
    }

    res.send({ 
      message: "Subject updated successfully", 
      subject: updatedSubject 
    });
  } catch (error) {
    res.status(400).send({ 
      message: "Error updating subject", 
      error: error.message 
    });
  }
});

// Delete subject - Admin only
router.delete("/:subjectId", isAdminAuthenticated, async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await SubjectModel.findByIdAndDelete(subjectId);
    
    if (!subject) {
      return res.status(404).send({ message: "Subject not found" });
    }

    fs.unlink(`./uploads/images/${subject.photoUrl}`, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully");
      }
    });
    

    res.send({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(400).send({ 
      message: "Error deleting subject", 
      error: error.message 
    });
  }
});

module.exports = router;