import express, { Application } from "express";
import http, { Server } from "node:http";

class HttpServer {
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

  public start = (port: number): void => {
    this.server.listen(port, () => {
      console.log(`server running at http://localhost:${port}/`);
    });
  };

  public getServer = (): Server => {
    return this.server;
  };
}

const httpServer = HttpServer.getInstance();
export default httpServer;
