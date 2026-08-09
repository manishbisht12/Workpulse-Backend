import express from "express";
import {
  getHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.use(protect);

router.route("/")
  .get(getHabits)
  .post(createHabit);

router.route("/:id")
  .delete(deleteHabit);

router.route("/:id/toggle")
  .patch(toggleHabit);

export default router;