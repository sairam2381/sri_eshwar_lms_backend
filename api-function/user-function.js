exports.createUser = async (req, res) => {
  try {
    const { firstName, email } = req.body;
    const creatUser = await User.insertOne({
      firstName: firstName,
      email: email,
    });
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
