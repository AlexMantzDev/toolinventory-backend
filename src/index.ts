import ToolService from "./application/services/ToolService";
import ToolController from "./infrastructure/api/controllers/tool.controller";
import { httpServer } from "./infrastructure/api";
import ToolRoutes from "./infrastructure/api/routes/tool.routes";
import { json } from "express";
import ToolRepository from "./infrastructure/persistence/repositories/ToolRepository";
import ToolDAOImpl from "./infrastructure/persistence/dao-impls/ToolDAOImplSequelize";

class Main {
  private constructor() {}

  static start = () => {
    new Main();
    console.log("Creating tool repository...");
    const toolDAO = new ToolDAOImpl();
    const toolRepository = new ToolRepository(toolDAO);
    console.log("Creating tool service...");
    const toolService = new ToolService(toolRepository);
    console.log("Creating tool controller...");
    const toolController = new ToolController(toolService);
    console.log("Creating tool routes...");
    const toolRoutes = new ToolRoutes(toolController);
    console.log("Assigning routes to Express...");
    httpServer.addMiddleware(json());
    httpServer.addRoutes("/api/v1/tools", toolRoutes.getRouter());
    console.log("Starting Express application...");
    httpServer.start(5000);
  };
}

Main.start();
