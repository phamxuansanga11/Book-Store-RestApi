const router = require("express").Router();
const bookController = require("../controllers/bookController");

//ADD A BOOK
router.post("/", bookController.addABook);

//GET A BOOK
router.get("/:id", bookController.getABook);

//GET ALL BOOK
router.get("/", bookController.gettAllBook);

//UPDATE BOOK
router.put("/:id", bookController.updateBook);

//DELETE BOOK
router.delete("/:id", bookController.deleteBook);

module.exports = router;
