const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const materialRoute = require("./routes/materialRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");
const receiptRoute = require("./routes/receiptRoute");
const taskRoute = require("./routes/taskRoute");
const clientRoute = require("./routes/clientRoute");
const deliveryRoute = require("./routes/deliveryRoute");
const jobRoute = require("./routes/jobRoute")
const dojobRoute = require("./routes/dojobRoute")

const app = express();
const allowedOrigins = [
    "http://localhost:3000",
    "https://vanytuong.vercel.app",
    "https://vanytuong.com"
];

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes middleware
app.use("/api/users", userRoute);
app.use("/api/materials", materialRoute);
app.use("/api/receipt", receiptRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/clients", clientRoute);
app.use("/api/delivery", deliveryRoute);
app.use("/api/job", jobRoute)
app.use("/api/dojob", dojobRoute)

// Home route
app.get("/", (req, res) => {
    res.send("Home page");
});

// Error middleware
app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));
