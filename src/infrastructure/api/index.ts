import express, {
  Application,
  Handler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import http, { Server } from "node:http";
import ToolRoutes from "./routes/ToolRoutes";

export default class HttpServer {
  private static instance: HttpServer;
  private server: Server;
  private app: Application;

  private constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  public static getInstance = (): HttpServer => {
    if (!HttpServer.instance) {
      HttpServer.instance = new HttpServer();
    }
    return HttpServer.instance;
  };

  public getApp = () => {
    return this.app;
  };

  public initialize = () => {};

  public start = (port: number): void => {
    this.server.listen(port, () => {
      console.log(`server running at http://localhost:${port}/`);
    });
  };

  public getServer = (): Server => {
    return this.server;
  };

  public addRoutes = (path: string, router: Router) => {
    this.app.use(path, router);
  };

  public addMiddleware = (middleware: RequestHandler) => {
    this.app.use(middleware);
  };
}

export const httpServer = HttpServer.getInstance();
