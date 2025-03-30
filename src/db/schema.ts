import { integer, text, boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("todo", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: text("createdAt").default(new Date().toISOString()),
});

export const passwordResetTokens = pgTable("password-reset-tokens", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .references(() => users.id)
    .notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: text("expiresAt").notNull(),
  createdAt: text("createdAt").default(new Date().toISOString()),
  used: boolean("used").default(false).notNull(),
});

export const blacklistedTokens = pgTable("blacklisted-tokens", {
  id: varchar("id", { length: 255 }).primaryKey(),
  token: varchar("token", { length: 500 }).notNull(),
  userId: varchar("userId", { length: 255 })
    .references(() => users.id)
    .notNull(),
  createdAt: text("createdAt").default(new Date().toISOString()),
  expiresAt: text("expiresAt").notNull(),
});
