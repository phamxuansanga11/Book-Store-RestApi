const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  books: [
    {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Book",
      type: Object,
    },
  ],
});

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumnail: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: String,
  },
  genres: {
    type: [String],
  },
  author: {
    // type: Object, //dang sua toi day roi`
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    cart: [
      {
        type: Object,
      },
    ],
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

let Book = mongoose.model("Book", bookSchema);
let Author = mongoose.model("Author", authorSchema);
let User = mongoose.model("User", userSchema);

module.exports = { Book, Author, User };
