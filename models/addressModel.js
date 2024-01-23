const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model

 const address = {
  phone_no: String,
  country: String,
  first_name: String,
  last_name: String,
  address: String,
  apartment: String,
  city: String,
  state: String,
  zipcode: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};

const addressSchema = new mongoose.Schema(address, {
  timestamps: true,
});

//Export the model
module.exports = {Address:mongoose.model("Address", addressSchema),addressType:address};
