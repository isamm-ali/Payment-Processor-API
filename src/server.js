import express from "express";
import dotenv from "dotenv";
import { app } from "../src/app.js";

dotenv.config();

import "./routes/customerRoutes.js";
import "./routes/paymentRoutes.js";

app.listen(process.env.PORT, () => {
  console.log("YOUR PAYMENT GATEWAY SERVER IS RUNNING");
});
