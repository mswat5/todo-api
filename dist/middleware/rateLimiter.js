"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.passwordResetLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        error: "Too many password reset attempts. Please try again in an hour.",
    },
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: "Too many login attempts. Please try again later.",
    },
});
//# sourceMappingURL=rateLimiter.js.map