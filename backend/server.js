const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

const donorRoutes = require("./routes/donors");

app.use("/api/donors", donorRoutes);

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Blood Donor Management System API is running!"
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Blood Donor Management System running at http://localhost:${PORT}`
    );
});