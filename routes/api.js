import express from "express";
import { createProcessController, getProgress } from "../controllers/ai-controllers.js";

const router = express.Router();

router.post('/start', createProcessController);
router.get('/progress', getProgress);

export default router;