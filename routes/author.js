const router = require("express").Router();
const authorController = require("../controllers/authorController");

//ADD AUTHOR
router.post("/", authorController.addAuthor);

//GET ALL AUTHOR
router.get("/", authorController.getAllAuthor);

//GET AN AUTHOR
router.get("/:id", authorController.getAnAuthor);

//UPDATE AUTHOR
router.put("/:id", authorController.updateAuthor);

//DELETE AUTHOR
router.delete("/:id", authorController.deleteAuthor);

module.exports = router;
