const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
  if (!id.id) return false;
  return mongoose.Types.ObjectId.isValid(id);
  // if (!isValid) throw new Error("This id is not valid or not Found");
};
module.exports = validateMongoDbId;
