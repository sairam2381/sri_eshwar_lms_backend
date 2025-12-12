const mongoose = require("mongoose");
const AssignmentCreated = new mongoose.Schema({
  assignmentName: {
    type: String,
    require: true,
  },
  deadline: {
    type: Date,
    require: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
module.exports = mongoose.model("AssignmentCreated", AssignmentCreated);
