import { Router } from "express";
import ToolController from "../controllers/tool.controller";

export default class ToolRoutes {
  private router: Router;
  constructor(private toolController: ToolController) {
    this.router = Router();
    this.router.get("/", this.toolController.getAllTools.bind(toolController));
    this.router.post("/", this.toolController.addTool.bind(toolController));
  }

  public getRouter = (): Router => {
    return this.router;
  };
}
