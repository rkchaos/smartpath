const express = require('express')
const app = express()
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const clientRouter = require("./routes/clientRouter")
const courseRouter = require("./routes/courseRoutes")
const quizwRouter = require("./routes/quizeRoute")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log("connected to database")
    })
    .catch((err) => {
        console.log(err)
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/test", (req, res) => {
    res.status(200).json({ msg: "ok " })
})
app.use(clientRouter)
app.use(courseRouter)
app.use(quizwRouter)

app.listen(process.env.PORT, () => {
    console.log("server is running on port " + process.env.PORT)
})