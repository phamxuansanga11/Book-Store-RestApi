const { Author, Book } = require("../model/model");

const bookController = {
  //ADD A BOOK
  addABook: async (req, res) => {
    try {
      const newBook = new Book(req.body);
      const savedBook = await newBook.save();
      if (req.body.author) {
        const author = await Author.findById(req.body.author);
        await author.updateOne({ $push: { books: savedBook._id } });
      }
      res.status(200).json(savedBook);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //GET A BOOK
  getABook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate("author");
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //GET ALL BOOKS
  gettAllBook: async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //UPDATE BOOK
  updateBook: async (req, res) => {
    try {
      const updateBook = await Book.findById(req.params.id);
      await updateBook.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully..!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //DETELE BOOK
  deleteBook: async (req, res) => {
    try {
      await Author.updateMany(
        { books: req.params.id },
        { $pull: { books: req.params.id } }
      );
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json("Delete successfully..!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = bookController;
