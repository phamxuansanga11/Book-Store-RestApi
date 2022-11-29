const { Author, Book, User } = require("../model/model");
const jwt_decode = require("jwt-decode");

const bookController = {
  //ADD A BOOK
  addABook: async (req, res) => {
    try {
      const { name, author, description, price, publishedDate, genres } =
        JSON.parse(req.body.book);
      const file = req.files.file;

      let bookDTO = {
        name,
        author,
        description,
        price,
        publishedDate,
        genres,
      };

      const uploadPath = `${process.env.UPLOAD_PATH}/${file.name}`;

      file.mv(uploadPath, async function (err) {
        if (err) return res.status(500).send(err);

        const filePath = `${file.name}`;
        bookDTO = { ...bookDTO, thumnail: filePath };

        const newBook = new Book(bookDTO);
        try {
          const resBook = await newBook.save();
          const thumnail = `${req.protocol}://${req.get("host")}/${file.name}`;
          res.status(200).send({ ...resBook._doc, thumnail });
        } catch (error) {
          return res.status(500).send(error);
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //GET A BOOK
  getABook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate("author");
      const thumnail = `${req.protocol}://${req.get("host")}/${book.thumnail}`;
      res.status(200).json({ ...book._doc, thumnail });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //GET ALL BOOKS
  gettAllBook: async (req, res) => {
    try {
      const books = await Book.find().populate("author");
      const protocol = `${req.protocol}://${req.get("host")}`;
      const resBooks = books.map((book) => ({
        ...book._doc,
        thumnail: `${protocol}/${book.thumnail}`,
      }));
      res.status(200).json(resBooks);
    } catch (error) {
      console.log(error);
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
  //ADD BOOK TO CART
  addBookToCart: async (req, res) => {
    try {
      const { id } = req.params;
      const token = req.headers.token;
      const decoded = jwt_decode(token);
      const user = await User.findById(decoded.id);
      let book = await Book.findById(id);
      const bookFromCarts = user.cart.find(
        (book) => book._id.toString() === id
      );
      let response;
      if (bookFromCarts) {
        book._doc.quantity = bookFromCarts.quantity + 1;
        response = await User.findByIdAndUpdate(
          { _id: user._id.toString() },
          {
            $set: {
              cart: user.cart.map((item) => {
                if (item._id.toString() === id) {
                  return { ...item, quantity: item.quantity + 1 };
                }
                return item;
              }),
            },
          },
          { new: true }
        );
      } else {
        book._doc.quantity = 1;
        response = await User.findByIdAndUpdate(
          { _id: user._id },
          {
            $push: { cart: book },
          },
          { new: true }
        );
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //UPDATE QUANTITY BOOK
  updateQuantityBook: async (req, res) => {
    try {
      const idBook = req.params.id;
      const token = req.headers.token;
      const decoded = jwt_decode(token);
      const user = await User.findById(decoded.id);
      let newQuantity = req.body.quantity;
      const updatedUser = await User.findByIdAndUpdate(
        { _id: user._id.toString() },
        {
          $set: {
            cart: user.cart.map((item) => {
              if (item._id.toString() === idBook) {
                return { ...item, quantity: item.quantity + newQuantity };
              }
              return item;
            }),
          },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = bookController;
