const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tutorId: {
      type: String,
      required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    photoUrl: String,
    

  },
  { versionKey: false, timestamps: true }
);

const SubjectModel = mongoose.model('subject', subjectSchema);
module.exports = { SubjectModel };