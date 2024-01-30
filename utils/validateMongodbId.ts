import mongoose  from "mongoose";
const validateMongoDbId = (id:string) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("This id is not valid or not Found");
};
export  {validateMongoDbId};
