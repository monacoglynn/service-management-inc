import express from "express";
const router = express.Router();
import {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
} from "../controllers/productController.js";
import { protect, verifiedAdmin } from "../util/authMiddleware.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
router
    .route("/")
    .get(getProducts)
    .post(protect, verifiedAdmin, createProduct)
    ;

// @desc Fetch  product via id
// @route GET /api/products/id
// @access Public
router
    .route("/:id")
    .get(getProductById)
    .delete(protect, verifiedAdmin, deleteProduct)
    .put(protect, verifiedAdmin, updateProduct);

export default router;
