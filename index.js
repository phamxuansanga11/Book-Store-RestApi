const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authorRouter = require("./routes/author");
const bookRouter = require("./routes/book");

dotenv.config();
//connect database
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Conected to MongoDB");
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

//ROUTER AUTHOR
app.use("/v1/author", authorRouter);

//ROUTER BOOK
app.use("/v1/book", bookRouter);

app.listen(8000, () => {
  console.log("Server is running...");
});
