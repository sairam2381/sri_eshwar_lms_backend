const express = require("express");
const {
  createUser,
  adminSignup,
  fetchAssignments,
  submitTest,
  userLogin,
} = require("../api-function/user-function");
const { auth, isUser, isAdmin } = require("../middleware/auth");
// const {
//   createUser,
//   createManyUsers,
//   getAllUsers,
//   updateEmail,
//   getDetails,
//   userRegister,
//   getAllUserDetails,
//   deleteUsers,
// } = require("../apis-function/user-functions");
const router = express.Router();
router.post("/userSignup", auth, isUser, createUser);
router.post("/adminSignup", auth, isAdmin, adminSignup);
router.get("/allAssignments", auth, isUser, fetchAssignments);
router.put("/submitTest", auth, isUser, submitTest);
router.post("/userLogin", auth, isUser, userLogin);
// router.get("/fetchProfile")
module.exports = router;
