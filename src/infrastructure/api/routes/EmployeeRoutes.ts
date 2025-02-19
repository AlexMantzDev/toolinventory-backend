import { Router } from "express";
import Routes from "./Routes";
import CRUDController from "../controllers/Controller";

export default class EmployeeRoutes implements Routes {
  private readonly _router: Router;
  constructor(private readonly _controller: CRUDController) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._router.get("/", this._controller.findAll.bind(this._controller));
    this._router.post("/", this._controller.create.bind(this._controller));
    this._router.get("/:id", this._controller.findById.bind(this._controller));
    this._router.put("/:id", this._controller.update.bind(this._controller));
    this._router.delete("/:id", this._controller.delete.bind(this._controller));
  }

  public get router(): Router {
    return this._router;
  }
}
