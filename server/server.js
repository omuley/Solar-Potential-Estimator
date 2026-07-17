import express from "express";
import estimateRouter from "./routes/estimate.js";

const app = express() //creates my server

app.use(express.json()); // Allows Express to read JSON sent by React

app.use("/api", estimateRouter);

app.listen(3000)
