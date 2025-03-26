import { Router } from "express";
import AuthController from "../controllers/AuthController";
import AuthMiddleware from "../middleware/AuthMiddleware";

export default class AuthRoutes {
  private readonly _router: Router;
  constructor(
    private readonly _controller: AuthController,
    private authMiddleware: AuthMiddleware
  ) {
    this._router = Router();
    this.initRoutes();
  }

  private initRoutes = () => {
    this._router.post("/login", this._controller.login.bind(this._controller));
    this._router.get(
      "/me",
      this.authMiddleware.authenticate,
      this._controller.me
    );
    this._router.post(
      "/logout",
      this.authMiddleware.authenticate,
      this._controller.logout.bind(this._controller)
    );
    this._router.post(
      "/register",
      this._controller.register.bind(this._controller)
    );
    this._router.put(
      "/update",
      this.authMiddleware.authenticate,
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
    this._router.put(
      "/deny-user",
      this.authMiddleware.authenticate,
      this._controller.denyUser.bind(this._controller)
    );
    this._router.put(
      "/permit-user",
      this.authMiddleware.authenticate,
      this._controller.permitUser.bind(this._controller)
    );
  };

  get router(): Router {
    return this._router;
  }
}
