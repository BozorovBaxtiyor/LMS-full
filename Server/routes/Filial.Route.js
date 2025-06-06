const express = require("express");
const router = express.Router();

const upload = require('../middlewares/upload');


// Model import
const { FilialModel } = require("../models/filial.model");

// Middleware import
const { isAdminAuthenticated, isSuperAdminAuthenticated } = require("../middlewares/authenticate");
const { route } = require("./Tutor.Route");

// Get all filials
router.get("/all", async (req, res) => {
  try {
    const filials = await FilialModel.find();
    res.send({ message: "All filials data", filials });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

// Create new filial (only admin/superadmin)
router.post("/create", isAdminAuthenticated,  upload.single('photo'), async (req, res) => {
    try {
  
        
      let uploadedFileName = null;
      const filialData = req.body;
      
      // Rasm yuklangan bo'lsa, uning URL ini qo'shish
      if (req.file) {
        filialData.photoUrl = req.file.filename;
        uploadedFileName = req.file.filename;
      }

      // console.log(req.file);
      
  
      const filial = new FilialModel(filialData);
      await filial.save();
  
      res.status(201).send({ 
        message: "Filial created successfully", 
        filial 
      });
    } catch (error) {
      if (uploadedFileName) {
        fs.unlink(`./uploads/images/${uploadedFileName}`, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }
      res.status(400).send({ 
        message: "Error creating filial", 
        error: error.message 
      });
    }
  });

// Update filial (only admin/superadmin)
router.patch("/:filialId", isAdminAuthenticated, async (req, res) => {
  try {
    const { filialId } = req.params;
    const updatedFilial = await FilialModel.findByIdAndUpdate(
      filialId,
      req.body.data,
      { new: true }
    );
    res.send({ message: "Filial updated successfully", filial: updatedFilial });
  } catch (error) {
    res.status(400).send({ message: "Error updating filial", error: error.message });
  }
});

// Delete filial (only superadmin)
router.delete("/:filialId", isSuperAdminAuthenticated, async (req, res) => {
  try {
    const { filialId } = req.params;
    const filial = await FilialModel.findById(filialId);
    if (!filial) {
      return res.status(404).send({ message: "Filial not found" });
    }
    await FilialModel.findByIdAndDelete(filialId);
    res.send({ message: "Filial deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error deleting filial", error: error.message });
  }
});

router.get("/:filialId", async (req, res) => {
  try {
    const { filialId } = req.params;
    const filial = await FilialModel.findById(filialId);
    if (!filial) {
      return res.status(404).send({ message: "Filial not found" });
    }
    res.send({ message: "Filial data", filial });
  } catch (error) {
    res.status(400).send({ message: "Error fetching filial data", error: error.message });
  }
});

// Find nearest filials
router.post("/nearest", async (req, res) => {
  try {

    console.log(req.body , 'req.body');

    const { lat, lng } = req.body;
    
    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).send({ message: "Latitude and longitude are required" });
    }

    // Convert string coordinates to numbers
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    // Get all filials
    const filials = await FilialModel.find();

    // Calculate distance for each filial and sort
    const filialsWithDistance = filials.map(filial => {
      const distance = calculateDistance(
        userLat,
        userLng,
        parseFloat(filial.lat.toString()),
        parseFloat(filial.lng.toString())
      );
      return {
        ...filial.toObject(),
        distance: distance
      };
    }).sort((a, b) => a.distance - b.distance);

    res.send({
      message: "Nearest filials",
      filials: filialsWithDistance
    });

  } catch (error) {
    res.status(400).send({ message: "Error finding nearest filials", error: error.message });
  }
});

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
           Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance; // Returns distance in kilometers
}

function toRad(degrees) {
  return degrees * (Math.PI/180);
}

module.exports = router;