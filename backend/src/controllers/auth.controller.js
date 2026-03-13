import userModel from "../models/user.model.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  const isUserExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    return res.status(400).json({
      message: "User already exists",
      success: false,
      err: "Username or email already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  })




}
