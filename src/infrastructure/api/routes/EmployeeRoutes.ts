import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import AuthMiddleware from "../middleware/AuthMiddleware";

export default class EmployeeRoutes {
  private readonly _router: Router;
  constructor(
    private readonly _controller: EmployeeController,
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
      "/:value",
      this.authMiddleware.authenticate,
      this._controller.find.bind(this._controller)
    );
    this._router.put(
      "/:value",
      this.authMiddleware.authenticate,
      this._controller.update.bind(this._controller)
    );
    this._router.delete(
      "/:value",
      this.authMiddleware.authenticate,
      this._controller.delete.bind(this._controller)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
