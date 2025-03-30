import { blacklistedTokens, passwordResetTokens, users } from "../db/schema.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../db/drizzle";
import { z } from "zod";
import { eq } from "drizzle-orm";
import crypto from "crypto";

import { sendPasswordResetEmail } from "../utils/email";

dotenv.config();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

export const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      })
      .returning();

    const token = jwt.sign({ userId: newUser[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      return res.status(200).json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }
    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.userId, user.id),
      orderBy: (tokens, { desc }) => [desc(tokens.createdAt)],
    });
    if (existingToken) {
      const tokenDate = new Date(existingToken.createdAt);
      const now = new Date();
      const diffMinutes = now.getTime() - tokenDate.getTime();

      if (diffMinutes < 15) {
        return res.status(429).json({
          message:
            "Please wait 15 minutes before requesting another reset link",
        });
      }
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await db.insert(passwordResetTokens).values({
      id: crypto.randomUUID(),
      userId: user.id,
      token: resetToken,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    });
    await sendPasswordResetEmail(user.email, resetToken, user.name || "");
    return res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });
    if (!resetToken || resetToken.used) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    if (new Date(resetToken.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, resetToken.userId));

    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id));
    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    await db.insert(blacklistedTokens).values({
      id: crypto.randomUUID(),
      token: token,
      userId: decoded.userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const blacklistedToken = await db.query.blacklistedTokens.findFirst({
      where: eq(blacklistedTokens.token, token),
    });

    if (blacklistedToken) {
      return res.status(401).json({ message: "Token is no longer valid" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
