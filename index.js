const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authorRouter = require("./routes/author");
const bookRouter = require("./routes/book");
const userRouter = require("./routes/authentication");
const fileupload = require("express-fileupload");
const path = require("path");
const PORT = 8000;

//use .env
dotenv.config();

//connect database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Conected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed connect to database..!!", err);
  });

//libarys
app.use(fileupload());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use(express.static(path.join(__dirname, "upload")));

//ROUTER AUTHOR
app.use("/v1/author", authorRouter);

//ROUTER BOOK
app.use("/v1/book", bookRouter);

//ROUTER USER
app.use("/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running...PORT: ${PORT}`);
});
