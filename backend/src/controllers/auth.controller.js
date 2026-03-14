import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

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
    user,
  });
}
