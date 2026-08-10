import express from "express";
import { getGoals, createGoal, deleteGoal } from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect middleware to all goal endpoints
router.use(protect);

router.route("/")
  .get(getGoals)
  .post(createGoal);

router.route("/:id")
  .delete(deleteGoal);

export default router;