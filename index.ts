import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import dbConnect from "./config/dbConnect";
import { notFound, errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import userRouter from "./routes/user/userRoute";
import productRouter from "./routes/productRoute";
import searchRouter from "./routes/searchRoute";
// const blogRouter = require("./routes/blogRoute");
// const categoryRouter = require("./routes/prodcategoryRoute");
// const blogcategoryRouter = require("./routes/blogCatRoute");
// const brandRouter = require("./routes/brandRoute");
// const colorRouter = require("./routes/colorRoute");
// const enqRouter = require("./routes/enqRoute");
import enqRouter from "./routes/enqRoute";
import imageRoute from "./routes/imageRoute";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config();

dbConnect();
app.use(morgan("dev"));
const allowedOrigins = [
  "https://techtreasure.vercel.app",
  "https://raiappliances-admin-panel.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

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
