import express from "express";
const router = express.Router();

import {
    addUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from "../controllers/userController.js";
import { protect, verifiedAdmin } from "../util/authMiddleware.js";

router.route("/").post(addUser).get(protect, verifiedAdmin, getUsers);
router.post("/login", authUser);
router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router
    .route("/:id")
    .delete(protect, verifiedAdmin, deleteUser)
    .get(protect, verifiedAdmin, getUserById)
    .put(protect, verifiedAdmin, updateUser);
export default router;
