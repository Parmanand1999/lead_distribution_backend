// backend/src/routes/ruleRoutes.js
import express from "express";
import {
  getRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
} from "../controllers/ruleController.js";

const router = express.Router();

router.get("/", getRules);
router.get("/:id", getRuleById);
router.post("/", createRule);
router.put("/:id", updateRule);
router.delete("/:id", deleteRule);

export default router;
