const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const {expressjwt} = require("express-jwt");

const app = express();
require("dotenv").config();

// connect mongodb
    mongoose.connect("mongodb://localhost:27017/quizzly", () => {
        console.log("mongodb is connected on port 27017.");
    });

// setup middleware for morgan logging and to parse req.body to json
    app.use(morgan("dev"));
    app.use(express.json());

// connect routes
    app.use("/auth", require("./routes/authRouter.js"));
    // set up protection for route:
    app.use("/api", expressjwt({secret: process.env.SECRET, algorithms: ['HS256']}));
    app.use("/api/user", require("./routes/userRouter.js"));
    app.use("/api/quiz", require("./routes/quizRouter.js"));

// test response - delete me after initial commit.
    app.get("/test", (req, res) => {
        res.send("Express server says... I am listening! on port 9000!");
    });

// setup error handler - relay error message to client via object
    app.use((err, req, res, next) => {
        if (err.name === "UnauthorizedError") {
            res.status(err.status);
        }
        return res.send({errMsg : err.message});
    });

// start server
    app.listen(9000, () => console.log("Express server is listening on port 9000."));