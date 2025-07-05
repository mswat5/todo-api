"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = __importDefault(require("../prisma/client"));
const updateProfileSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).optional(),
    email: joi_1.default.string().email().optional(),
    currentPassword: joi_1.default.string().min(6).optional(),
    newPassword: joi_1.default.string().min(6).optional(),
}).custom((value, helpers) => {
    if (value.newPassword && !value.currentPassword) {
        return helpers.error('any.invalid', {
            message: 'Current password is required when setting new password'
        });
    }
    return value;
});
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const response = {
            success: true,
            message: 'Profile retrieved successfully',
            data: { user }
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { error, value } = updateProfileSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }
        const { name, email, currentPassword, newPassword } = value;
        const user = await client_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (email && email !== user.email) {
            const existingUser = await client_1.default.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }
        let hashedNewPassword;
        if (newPassword && currentPassword) {
            const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }
            hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
        }
        const updatedUser = await client_1.default.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(hashedNewPassword && { password: hashedNewPassword })
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });
        const response = {
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=userController.js.map