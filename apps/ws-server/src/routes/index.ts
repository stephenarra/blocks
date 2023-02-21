import { Router } from "express";
import healthRoutes from "./health";

const router = Router();

router.use("/health", healthRoutes);

// fallback 404
router.use("/", (req, res) => res.status(404).json("No route for this path"));

export default router;
