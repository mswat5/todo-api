import { db } from "../db/drizzle";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

import { z } from "zod";
import bcrypt from "bcryptjs";

const updateProfileSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required when setting new password",
    }
  );

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = updateProfileSchema.parse(req.body);

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (updateData.email && updateData.email != user.email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, updateData.email),
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      if (updateData.newPassword) {
        const validPassword = await bcrypt.compare(
          updateData.currentPassword!,
          user.password
        );

        if (!validPassword) {
          return res
            .status(401)
            .json({ message: "Current password is incorrect" });
        }
        updateData.password = await bcrypt.hash(updateData.newPassword, 10);
      }
      const { currentPassword, newPassword, ...updateFields } = updateData;

      await db
        .update(users)
        .set({
          ...updateFields,
          ...(updateData.newPassword && { password: updateData.password }),
        })
        .where(eq(users.id, userId));

      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      return res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser!.id,
          name: updatedUser!.name,
          email: updatedUser!.email,
          createdAt: updatedUser!.createdAt,
        },
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
