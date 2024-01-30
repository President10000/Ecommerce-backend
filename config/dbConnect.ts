import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const dbConnect = () => {
  const db = process.env.MONGODB_URI;
  if (!db) {
    throw new Error("data base not found");
  }
  try {
    mongoose.connect(db);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};
export default dbConnect;
