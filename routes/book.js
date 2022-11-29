const router = require("express").Router();
const bookController = require("../controllers/bookController");
const middlewareController = require("../controllers/middlewareController");

//ADD A BOOK
router.post(
  "/",
  middlewareController.verifyAdminToken,
  bookController.addABook
);

//GET A BOOK
router.get("/:id", bookController.getABook);

//GET ALL BOOK
router.get("/", bookController.gettAllBook);

//UPDATE BOOK
router.put("/:id", bookController.updateBook);

//DELETE BOOK
router.delete("/:id", bookController.deleteBook);

//ADD TO CART
router.post(
  "/addtocart/:id",
  middlewareController.verifyToken,
  bookController.addBookToCart
);

//UPDATE QUANTITY BOOK
router.put(
  "/update-quantifybook/:id",
  middlewareController.verifyToken,
  bookController.updateQuantityBook
);

module.exports = router;
