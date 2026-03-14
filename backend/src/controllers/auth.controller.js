import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

// register => check user existance => create user => email verification token generate => send verification email => send response
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
  });

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "6d" },
  );

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<p>Hi ${username},</p>
      <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
     <p>Click the link below to verify your email:</p>
     <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
     <p>If you did not create an account, please ignore this email.</p>
    <p>Best regards,<br>The Perplexity Team</p>`,
  });

  res.status(201).json({
    message: "user registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}
// verify email => token verification => user find => check if already verified => if not verified then verify and send response
export async function verifyEmail(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      message: "Invalid or missing token",
      success: false,
      err: "Token is required for email verification",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "No user associated with this token",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      message: "Email already verified",
      success: false,
      err: "This email has already been verified",
    });
  } else {
    user.verified = true;
    await user.save();
    const html = `<p>Hi ${user.username},</p>
    <p>Your email has been successfully verified. You can now log in to your account and start using Perplexity!</p>
    <p>Best regards,<br>The Perplexity Team</p>`;
    await sendEmail({
      to: user.email,
      subject: "Email Verified Successfully",
      html,
    });
    return res.send(html);
  }
}

// login => check email or username => password compare => email verification check => token generate => send response
export async function login(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(404).json({
      message: "Invalid email or password",
      success: false,
      err: "User not found",
    });
  }

  // password compare by predefined method in userModel

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "Incorrect Password",
    });
  }

  // email verification check

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "user logged in successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

export async function getMe(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "No user found with this id",
    });
  }

  res.status(200).json({
    message: "Current user details fetched successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}
