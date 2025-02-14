import { Router } from "express";
import Controller from "../interfaces/controller";
import Routes from "../interfaces/routes";

export default class ToolRoutes implements Routes {
  private readonly _router: Router;
  constructor(private readonly _controller: Controller) {
    this._router = Router();
    this._router.get("/", this._controller.findAll.bind(_controller));
    this._router.post("/", this._controller.create.bind(_controller));
    this._router.get("/:id", this._controller.findById.bind(_controller));
    this._router.put("/:id", this._controller.update.bind(_controller));
    this._router.delete("/:id", this._controller.delete.bind(_controller));
  }

  public get controller(): Controller {
    return this._controller;
  }

  public get router(): Router {
    return this._router;
  }
}
