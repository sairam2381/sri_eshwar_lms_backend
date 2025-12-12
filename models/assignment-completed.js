const mongoose = require("mongoose");
const AssignmentCompleted = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssignmentCreated",
  },
  marks: {
    type: Number,
  },
  completedTime: {
    type: Date,
    require: true,
  },
});
module.exports = mongoose.model("AssignmentCompleted", AssignmentCompleted);
