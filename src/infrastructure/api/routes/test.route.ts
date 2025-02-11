import { Router } from "express";
import toolController from "../controllers/tool.controller";

const router = Router();

router.get("/", toolController.addTool.bind(toolController));

export default router;
