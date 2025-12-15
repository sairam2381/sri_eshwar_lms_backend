const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : req?.body?.token;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token is missing",
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT);
      req.user = decode;
      next();
    } catch (e) {}
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: "Auth is done",
    });
  }
};
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType != "Admin") {
      return res.status(400).json({
        success: false,
        message: "This is allowed only for admin",
      });
    }
    // return res.status(200).json({
    //   success: true,
    //   message: "you are alllowed",
    // });
    next();
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: "Auth is done",
    });
  }
};

exports.isUser = async (req, res, next) => {
  try {
    if (req.user.accountType != "User") {
      return res.status(400).json({
        success: false,
        message: "This is allowed only for user",
      });
    }
    // return res.status(200).json({
    //   success: true,
    //   message: "you are alllowed",
    // });
    next();
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: "Auth is done",
    });
  }
};
