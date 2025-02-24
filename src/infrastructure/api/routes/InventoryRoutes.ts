import { Router } from "express";
import InventoryController from "../controllers/InventoryController";

export default class InventoryRoutes {
  private readonly _router: Router;
  constructor(private readonly _controller: InventoryController) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.post(
      "/checkout",
      this._controller.checkout.bind(this._controller)
    );
    this._router.delete(
      "/return",
      this._controller.return.bind(this._controller)
    );
    this._router.get(
      "/lookup/employees/",
      this._controller.getAllEmployeesWithTools.bind(this._controller)
    );
    this._router.get(
      "/lookup/employees/:employeeId",
      this._controller.getToolsByEmployee.bind(this._controller)
    );
    this._router.get(
      "/lookup/tools",
      this._controller.getAllCheckedOutTools.bind(this._controller)
    );
    this._router.get(
      "/lookup/tools/:toolId",
      this._controller.getEmployeeByTool.bind(this._controller)
    );
    this._router.post("/", this._controller.checkout.bind(this._controller));
    this._router.delete("/", this._controller.return.bind(this._controller));
  }

  public get router(): Router {
    return this._router;
  }
}
