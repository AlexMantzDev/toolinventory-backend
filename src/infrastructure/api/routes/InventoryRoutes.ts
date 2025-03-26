import { Router } from "express";
import InventoryController from "../controllers/InventoryController";
import AuthMiddleware from "../middleware/AuthMiddleware";

export default class InventoryRoutes {
  private readonly _router: Router;
  constructor(
    private readonly _controller: InventoryController,
    private authMiddleware: AuthMiddleware
  ) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.post(
      "/checkout",
      this.authMiddleware.authenticate,
      this._controller.checkoutTool.bind(this._controller)
    );
    this._router.delete(
      "/return",
      this.authMiddleware.authenticate,
      this._controller.returnTool.bind(this._controller)
    );
    this._router.get(
      "/lookup/employees/",
      this.authMiddleware.authenticate,
      this._controller.getAllEmployeesWithTools.bind(this._controller)
    );
    this._router.get(
      "/lookup/employees/:value",
      this.authMiddleware.authenticate,
      this._controller.getToolsByEmployee.bind(this._controller)
    );
    this._router.get(
      "/lookup/tools",
      this.authMiddleware.authenticate,
      this._controller.getAllCheckedOutTools.bind(this._controller)
    );
    this._router.get(
      "/lookup/tools/:value",
      this.authMiddleware.authenticate,
      this._controller.getEmployeeByTool.bind(this._controller)
    );
    this._router.post(
      "/",
      this._controller.checkoutTool.bind(this._controller)
    );
    this._router.delete(
      "/",
      this._controller.returnTool.bind(this._controller)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
