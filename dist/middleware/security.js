"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
exports.securityMiddleware = [
    (0, helmet_1.default)(),
    (0, cors_1.default)({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    }),
    (0, morgan_1.default)("combined"),
];
//# sourceMappingURL=security.js.map