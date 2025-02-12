import { Router } from "express";
import ToolController from "../controllers/tool.controller";

export default class ToolRoutes {
  private router: Router;
  constructor(private toolController: ToolController) {
    this.router = Router();
    this.router.get("/", this.toolController.getAllTools.bind(toolController));
    this.router.post("/", this.toolController.addTool.bind(toolController));
    this.router.get(
      "/:id",
      this.toolController.getToolById.bind(toolController)
    );
    this.router.put(
      "/:id",
      this.toolController.updateTool.bind(toolController)
    );
    this.router.delete(
      "/:id",
      this.toolController.deleteToolById.bind(toolController)
    );
  }

  public getRouter = (): Router => {
    return this.router;
  };
}
