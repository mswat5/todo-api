"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimiter_1 = require("../middleware/rateLimiter");
const auth_1 = require("../middleware/auth");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/login", rateLimiter_1.loginLimiter, authController_1.loginUser);
router.post("/register", authController_1.registerUser);
router.post("/logout", auth_1.verifyToken, authController_1.logoutUser);
exports.default = router;
//# sourceMappingURL=auth.js.map