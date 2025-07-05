"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.use(auth_1.verifyToken);
router.get('/profile', userController_1.getUserProfile);
router.put('/profile', userController_1.updateUserProfile);
exports.default = router;
//# sourceMappingURL=users.js.map