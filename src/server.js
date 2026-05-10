// Create server using express
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import certificateRoutes from "./routes/certificate.route.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

app.use("/api/certificates", certificateRoutes);
app.use("/api/user", userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
