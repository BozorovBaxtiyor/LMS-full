
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filialSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    lat: {
        type: Schema.Types.Decimal128,  // To'g'rilangan qator
        required: true,
      },
      lng: {
        type: Schema.Types.Decimal128,  // To'g'rilangan qator
        required: true,
      },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photoUrl: String,
  },
  { versionKey: false, timestamps: true }
);
const FilialModel = mongoose.model('filial', filialSchema);
module.exports = { FilialModel };