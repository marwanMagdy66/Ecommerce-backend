import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import subcategoryRouter from "./src/modules/subCategory/subCategory.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import couponRouter from "./src/modules/copoun/copoun.router.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import reviewRouter from "./src/modules/review/review.router.js";
import morgan from "morgan";
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT;
//morgan
app.use(morgan("combined"));
//CORS
// const whiteList = ["http://127.0.0.1:5500"];
// app.use((req, res, next) => {
//   console.log(req.header("origin"));
//   if (!whiteList.includes(req.header("origin"))) {
//     return next(new Error("Access Denied"));
//   }
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.setHeader("Access-Control-Private-Network", true);
//   return next();
// });
app.use(cors())  /// allow access from everywhare
//parsing
app.use(express.json());

//connect db
await connectDB();

// createInvoice(invoice, "invoice.pdf");
//routers
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/brand", brandRouter);
app.use("/coupon", couponRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);
//page not found handler
app.all("*", (req, res, next) => {
  return next(new Error("Page not found", { cause: 404 }));
});

//global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  res
    .status(statusCode)
    .json({ success: false, message: error.message, stack: error.stack });
});

app.listen(port, console.log(`app running on port ${port}!`));
