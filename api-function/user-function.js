const Admin = require("../models/admin");
const User = require("../models/user");
const assignmentCompleted = require("../models/assignment-completed");
const assignmentCreated = require("../models/assignment-created");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      active,
      password,
    } = req.body;
    // console.log("Hello I am COMING OVER HERE");
    const bcryptedPassword = await bcrypt.hash(password, 10);
    const [checkDetails, checkUserDetails] = await Promise.all([
      Admin.findOne({ mobileNumber, email }),
      User.findOne({ mobileNumber, email }),
    ]);
    if (checkDetails || checkUserDetails) {
      return res.status(400).json({
        success: false,
        message: "email/mobile number already exists",
      });
    }
    const userDetails = await User.create({
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      active: false,
      password: bcryptedPassword,
    });

    await Admin.findOneAndUpdate(
      { collegeName: collegeName },
      { $push: { listOfRequest: userDetails._id } }
    );
    return res.status(200).json({
      success: true,
      message: "User is created successfully",
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      error: e,
    });
  }
};
exports.adminSignup = async (req, res) => {
  try {
    const {
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      password,
    } = req.body;
    const checkCollege = await Admin.findOne({ collegeName });
    if (checkCollege) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }
    const [checkDetails, checkUserDetails] = await Promise.all([
      Admin.findOne({ mobileNumber, email }),
      User.findOne({ mobileNumber, email }),
    ]);
    if (checkDetails || checkUserDetails) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }
    const createAdmin = await Admin.create({
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      password,
    });
    return res.status(200).json({
      success: true,
      message: "Admin is created",
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      error: e,
    });
  }
};
exports.fetchAssignments = async (req, res) => {
  try {
    const { userId } = req.query;
    const getAssignments = await User.findById(userId).populate(
      "setOfAssignmentsAssigned"
    );
    return res.status(200).json({
      success: true,
      assignmentList: getAssignments.setOfAssignmentsAssigned,
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      error: e,
    });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { userId, assignmentId } = req.body;
    const user = await User.findById(userId);
    const isAssigned = user.setOfAssignmentsAssigned.some(
      (id) => id.toString() === assignmentId
    );

    if (!isAssigned) {
      return res.status(400).json({
        success: false,
        message: "you have already submitted the test",
      });
    }
    const completeAssignment = await assignmentCompleted.create({
      user: userId,
      assignment: assignmentId,
    });
    const updateAssignment = await assignmentCreated.findByIdAndUpdate(
      assignmentId,
      {
        $push: { assignmentCompleted: completeAssignment._id },
      },
      { new: true }
    );
    const updateUser = await User.findByIdAndUpdate(userId, {
      $pull: { setOfAssignmentsAssigned: assignmentId },
    });
    return res.status(200).json({
      success: true,
      message: "Test is submitted successfully",
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      error: e,
    });
  }
};
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email: email });
    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "Account is not registered",
      });
    }
    if (checkUser.active === false) {
      return res.status(400).json({
        success: false,
        message: "Account is deactivated",
      });
    }
    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (isMatch === false) {
      return res.status(400).json({
        success: false,
        message: "Password is not correct",
      });
    }
    const token = jwt.sign(
      {
        email: checkUser.email,
        id: checkUser._id,
        accountType: "User",
        collegeName: checkUser.collegeName,
      },
      process.env.JWT,
      { expiresIn: "24h" }
    );
    checkUser.password = undefined;
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      userDetails: checkUser,
    });
  } catch (e) {
    console.log("The error:", e);

    res.status(404).json({
      success: false,
      error: e,
    });
  }
};
