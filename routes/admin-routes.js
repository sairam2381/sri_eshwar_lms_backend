const express = require("express");
const {
  getAllRequests,
  acceptOrDecline,
  createAssignments,
  deactivateUser,
} = require("../api-function/admin-function");
const router = express.Router();
router.get("/getRequests", getAllRequests);
router.post("/acceptorDelete", acceptOrDecline);
router.post("/createAssignments", createAssignments);
router.put("/deactivateUser", deactivateUser);
module.exports = router;
