const userController = require("../controllers/authentication");
const middlewareController = require("../controllers/middlewareController");
const router = require("express").Router();

//REGISTER
router.post("/register", userController.registerUser);

//LOGIN
router.post("/login", userController.userLogin);

//GET ALL USER
router.get("/", middlewareController.verifyToken, userController.getAllUser);

//DELETE USER
router.delete(
  "/:id",
  middlewareController.verifyAdminToken,
  userController.deleteUser
);

//REFRESH TOKEN
router.post("/refresh", userController.refreshToken);

//LOG OUT
router.post(
  "/logout",
  middlewareController.verifyToken,
  userController.logOutUser
);

//GET CART OF USER
router.post(
  "/getcart/:id",
  middlewareController.verifyToken,
  userController.getCartOfUser
);

//DELETE BOOK TO CART FROM USER
router.delete(
  "/deletebooktocart/:id",
  middlewareController.verifyToken,
  userController.deteleBookToCart
);

module.exports = router;
