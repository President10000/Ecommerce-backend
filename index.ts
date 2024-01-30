// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
// const express = require("express");
import express, { Request, Response } from "express";
// const dbConnect = require("./config/dbConnect");
import dbConnect from "./config/dbConnect";
import { notFound, errorHandler } from "./middlewares/errorHandler";
const app = express();
// const dotenv = require("dotenv").config();
import dotenv from "dotenv";
// const userRouter = require("./routes/user/userRoute");
import userRouter from "./routes/user/userRoute";
// const productRouter = require("./routes/productRoute");
import productRouter from "./routes/productRoute";
// const searchRouter = require("./routes/searchRoute");
import searchRouter from "./routes/searchRoute";
// const blogRouter = require("./routes/blogRoute");
// const categoryRouter = require("./routes/prodcategoryRoute");
// const blogcategoryRouter = require("./routes/blogCatRoute");
// const brandRouter = require("./routes/brandRoute");
// const colorRouter = require("./routes/colorRoute");
// const enqRouter = require("./routes/enqRoute");
import enqRouter from "./routes/enqRoute";
// const couponRouter = require("./routes/couponRoute");
// const imageRoute = require("./routes/imageRoute");
import imageRoute from "./routes/imageRoute";
// const razorpay = require("./routes/razorpay");
// const cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser";
// const morgan = require("morgan");
import morgan from "morgan";

// const cors = require("cors");
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 4000;
dbConnect();
app.use(morgan("dev"));

// app.use(
//   cors({
//     origin: (
//       origin: string | undefined,
//       callback: (err: Error | null, allowed: boolean) => void
//     ) => {
//       if (origin) {
//         let allowedOrigins = [
//           "https://techtreasure.vercel.app",
//           "https://raiappliances-admin-panel.vercel.app",
//           "http://localhost:5173",
//           "http://localhost:5174",
//         ];
//         callback(null, allowedOrigins.indexOf(origin) !== -1);
//       } else {
//         callback(new Error("Invalid origin"), false);
//       }
//     },
//     credentials: true,
//   })
// );
app.use(cors({ credentials: true, origin: true }) as any);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/search", searchRouter);
app.use("/api/image", imageRoute);

app.use("/api/enquiry", enqRouter);

// app.use("/api/razorpay", razorpay);

// app.use("/api/blog", blogRouter);
// app.use("/api/category", categoryRouter);
// app.use("/api/blogcategory", blogcategoryRouter);
// app.use("/api/brand", brandRouter);
// app.use("/api/coupon", couponRouter);
// app.use("/api/color", colorRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
