import jwt from "jsonwebtoken"

const generateRefreshToken = (id:string) => {
  const secret =process.env.JWT_SECRET
if(!secret){throw new Error("secret not found")}
  return jwt.sign({ id }, secret, { expiresIn: "3d" });
};

export{ generateRefreshToken };
