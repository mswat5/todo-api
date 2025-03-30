import rateLimit from "express-rate-limit";

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, //1 hr me 3 baar hi sirf
  max: 3,
  message: {
    error: "Too many password reset attempts. Please try again in an hour.",
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many login attempts. Please try again later.",
  },
});
