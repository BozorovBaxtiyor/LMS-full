const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    tutorId: {
      type: String,
      required: true,
    },
   
  },
  { versionKey: false, timestamps: true }
);

const GroupModel = mongoose.model('group', groupSchema);
module.exports = { GroupModel };