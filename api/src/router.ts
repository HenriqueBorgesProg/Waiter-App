import path from "node:path";
import { fileURLToPath } from "url";
import { Router } from "express";
import multer from "multer";

import { listCategories } from "./app/useCases/categories/listCategories.js";
import { createCategory } from "./app/useCases/categories/createCategory.js";
import { deleteCategory } from "./app/useCases/categories/deleteCategory.js";
import { listProducts } from "./app/useCases/products/listProducts.js";
import { createProduct } from "./app/useCases/products/createProduct.js";
import { deleteProduct } from "./app/useCases/products/deleteProduct.js";
import { listProductsByCategory } from "./app/useCases/categories/listProductsByCategory.js";
import { listOrders } from "./app/useCases/orders/listOrders.js";
import { createOrder } from "./app/useCases/orders/createOrder.js";
import { changeOrderStatus } from "./app/useCases/orders/changeOrderStatus.js";
import { cancelOrder } from "./app/useCases/orders/cancelOrder.js";

export const router = Router();

// Corrigindo dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.resolve(__dirname, "..", "uploads"));
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Rotas
router.get("/categories", listCategories);
router.post("/categories", createCategory);
router.delete("/categories/:categoryId", deleteCategory);

router.get("/categories/:categoryId/products", listProductsByCategory);

router.get("/products", listProducts);
router.post("/products", upload.single("image"), createProduct);
router.delete("/products/:productId", deleteProduct);

router.get("/orders", listOrders);
router.post("/orders", createOrder);
router.patch("/orders/:orderId", changeOrderStatus);
router.delete("/orders/:orderId", cancelOrder);
