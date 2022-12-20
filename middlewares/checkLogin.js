const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userName, userId } = decoded;
    req.userName = userName;
    req.userId = userId;
    next();
  } catch (err) {
    next("Authorization failure!");
  }
};

module.exports = checkLogin;
