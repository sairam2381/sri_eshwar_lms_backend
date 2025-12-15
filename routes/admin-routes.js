const express = require("express");
const {
  getAllRequests,
  acceptOrDecline,
  createAssignments,
  deactivateUser,
  submitTest,
  getAssignmentResults,
} = require("../api-function/admin-function");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();
router.get("/getRequests", auth, isAdmin, getAllRequests);
router.post("/acceptorDelete", auth, isAdmin, acceptOrDecline);
router.post("/createAssignments", auth, isAdmin, createAssignments);
router.put("/deactivateUser", auth, isAdmin, deactivateUser);
router.get("/getAssignmentResults", auth, isAdmin, getAssignmentResults);
// router.put("/submitTest", submitTest);
module.exports = router;
