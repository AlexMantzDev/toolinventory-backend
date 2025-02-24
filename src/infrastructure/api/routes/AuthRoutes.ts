import { Router } from "express";
import Routes from "./Routes";
import AuthController from "../controllers/AuthController";
import { authenticate } from "../middleware/authHandler";

export default class AuthRoutes implements Routes {
  private readonly _router: Router;
  constructor(private readonly _controller: AuthController) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes = () => {
    this._router.post("/login", this._controller.login.bind(this._controller));
    this._router.post(
      "/logout",
      authenticate,
      this._controller.logout.bind(this._controller)
    );
    this._router.post(
      "/register",
      this._controller.register.bind(this._controller)
    );
    this._router.put(
      "/update",
      authenticate,
      this._controller.update.bind(this._controller)
    );
    this._router.post(
      "/resend",
      this._controller.resendVerifyLink.bind(this._controller)
    );
    this._router.post(
      "/reset-pass",
      this._controller.resetPassword.bind(this._controller)
    );
    this._router.post(
      "/change-pass",
      this._controller.changePassword.bind(this._controller)
    );
    this._router.get(
      "/verify",
      this._controller.verifyUser.bind(this._controller)
    );
    this._router.post(
      "/refresh",
      this._controller.refresh.bind(this._controller)
    );
  };

  get router(): Router {
    return this._router;
  }
}
