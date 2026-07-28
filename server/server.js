require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");

const { connectDB } = require("./src/init/connectDB");
const router = require("./src/routes/routes");

const app = express();
const server = http.createServer(app);
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", router);

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint Not Found",
  });
});

connectDB()
  .then(() => {
    console.log("Connected to OracleDB");
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server running on port: " + PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to OracleDB:", error);
  });