const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute")
const materialRoute = require("./routes/materialRoute")
const errorHandler = require("./middleware/errorMiddleware")
const cookieParser = require("cookie-parser")
const path = require("path")
const receiptRoute = require("./routes/receiptRoute")
const taskRoute = require("./routes/taskRoute")
const clientRoute = require("./routes/clientRoute")
const deliveryRoute = require("./routes/deliveryRoute")


const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors(
    {
        origin: ["http://localhost:3000", "https://vanytuong.vercel.app"],
        credentials: true
    }
))


app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// Routes middleware
app.use("/api/users", userRoute);
app.use("/api/materials", materialRoute);
app.use("/api/receipt", receiptRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/clients", clientRoute);
app.use("/api/delivery", deliveryRoute);


//Routes
app.get("/", (req, res) => {
    res.send("Home page");
});

//Error middleware
app.use(errorHandler);

//Connect to DB and start server
const PORT = process.env.PORT || 5000;

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin',process.env.FRONTEND_URL);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`)
        })
    })

    .catch((err) => console.log(err))