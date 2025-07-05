import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

export const securityMiddleware = [
  helmet(),
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
  morgan("combined"),
];
