const { User } = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

let = refreshTokenArr = [];

const userController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      //encode password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //create new User
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        cart: req.body.cart,
      });
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //CREATE ACCESS__TOKEN
  createAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT__ACCESS__KEY,
      { expiresIn: "30d" }
    );
  },
  //CREATE REFRESH__TOKEN
  createRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT__REFRESH__KEY,
      { expiresIn: "365d" }
    );
  },
  //LOGIN
  userLogin: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Wrong userName...!");
        return;
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("Wrong passWord...!");
      }
      if (user && validPassword) {
        const accessToken = userController.createAccessToken(user);
        const refreshToken = userController.createRefreshToken(user);
        refreshTokenArr.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //GET ALL USER
  getAllUser: async (req, res) => {
    try {
      const users = await User.find().populate("cart");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //DELETE USER
  deleteUser: async (req, res) => {
    try {
      await User.findById(req.params.id);
      res.status(200).json("Delete successfully..!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //REFRESH TOKEN
  refreshToken: async (req, res) => {
    try {
      const refreshTokenFromClient = req.cookies.refreshToken;
      if (!refreshTokenFromClient) {
        return res.status(401).json("You're is not authenticated");
      }
      if (!refreshTokenArr.includes(refreshTokenFromClient)) {
        res.status(403).json("Refresh Token is not valid");
        return;
      }
      jwt.verify(
        refreshTokenFromClient,
        process.env.JWT__REFRESH__KEY,
        (err, user) => {
          if (err) {
            res.status(404).json("Refresh Token loi~ roi");
          }
          refreshTokenArr = refreshTokenArr.filter(
            (token) => token !== refreshTokenFromClient
          );
          // nếu không lỗi thì tạo accessToken mới và refreshToken mới
          const newAccessToken = userController.createAccessToken(user);
          const newRefreshToken = userController.createRefreshToken(user);
          refreshTokenArr.push(newRefreshToken);
          res.cookie("refreshToken", newRefreshToken);
          res.status(200).json({ newAccessToken });
        }
      );
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //LOG OUT
  logOutUser: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      refreshTokenArr = refreshTokenArr.filter(
        (token) => token !== req.cookies.refreshToken
      );
      res.status(200).json("Logged out success..!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //GET CART OF USER
  getCartOfUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const cart = user.cart;
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //DELETE BOOK TO CART FROM USER
  deteleBookToCart: async (req, res) => {
    try {
      const decoded = jwt_decode(req.headers.token);
      const user = await User.findById(decoded.id);
      await User.updateOne(
        { _id: user._id.toString() },
        {
          $set: {
            cart: user.cart.filter(
              (book) => book._id.toString() !== req.params.id
            ),
          },
        },
        { upsert: true }
      );
      res.status(200).json("Delete successfully..!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
