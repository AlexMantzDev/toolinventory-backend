import { Router } from "express";
import ToolController from "../controllers/ToolController";
import AuthMiddleware from "../middleware/AuthMiddleware";

export default class ToolRoutes {
  private readonly _router: Router;
  constructor(
    private readonly _controller: ToolController,
    private authMiddleware: AuthMiddleware
  ) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get(
      "/",
      this.authMiddleware.authenticate,
      this._controller.findAll.bind(this._controller)
    );
    this._router.post(
      "/",
      this.authMiddleware.authenticate,
      this._controller.create.bind(this._controller)
    );
    this._router.get(
      "/:id",
      this.authMiddleware.authenticate,
      this._controller.findById.bind(this._controller)
    );
    this._router.put(
      "/:id",
      this.authMiddleware.authenticate,
      this._controller.update.bind(this._controller)
    );
    this._router.delete(
      "/:id",
      this.authMiddleware.authenticate,
      this._controller.delete.bind(this._controller)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
