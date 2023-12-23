const { default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);
const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};
module.exports = dbConnect;
