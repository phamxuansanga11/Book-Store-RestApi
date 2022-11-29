const jwt = require("jsonwebtoken");

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT__ACCESS__KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
          return;
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  },
  //verifyAdminToken
  verifyAdminToken: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not allowed add book except admin");
      }
    });
  },
};

module.exports = middlewareController;
