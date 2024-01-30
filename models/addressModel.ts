import mongoose  from "mongoose";

// Declare the Schema of the Mongo model

 const addressType = {
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

const addressSchema = new mongoose.Schema(addressType, {
  timestamps: true,
});
const Address=mongoose.model("Address", addressSchema)
//Export the model
export  {Address,addressType};
