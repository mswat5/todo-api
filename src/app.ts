import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth";

import { securityMiddleware } from "./middleware/security.ts";
import { loginLimiter } from "./middleware/rateLimiter.ts";
import { cleanupBlacklistedTokens } from "./utils/cleanup.ts";

const app = express();

app.use(securityMiddleware);
setInterval(cleanupBlacklistedTokens, 24 * 60 * 60 * 1000);
app.use(express.json());

app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/users", authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
