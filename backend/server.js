require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/users");
const errorHandler = require("./middlewares/error");

// Connect to DB
connectDB();

// Express App
const app = express();
const port = process.env.PORT || 3500;

// middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/api/products", (req, res) => {
  return res.status(200).json({
    message: "This is new feature change, a new route for products",
  });
});

app.use(errorHandler);
const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log(`${db.port}`, "db.port");
  console.log("Connected to MongoDB");

  const server = app.listen(port, () => console.log(`Server started listening on ${port}`));
  // Close the database connection when the server is shutting down
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });

  // Handling promise rejections during server startup
  process.on("unhandledRejection", (error, promise) => {
    console.error("Unhandled Promise Rejection:", error);
    server.close(() => process.exit(1));
  });
});
