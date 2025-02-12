import ToolService from "./application/services/ToolService";
import ToolController from "./infrastructure/api/controllers/tool.controller";
import ToolRepositoryImpl from "./infrastructure/persistence/ToolRepositoryImpl";
import { httpServer } from "./infrastructure/api";
import ToolRoutes from "./infrastructure/api/routes/tool.routes";

class Main {
  private constructor() {}

  static start = () => {
    new Main();
    console.log("Creating tool repository...");
    const toolRepository = new ToolRepositoryImpl();
    console.log("Creating tool service...");
    const toolService = new ToolService(toolRepository);
    console.log("Creating tool controller...");
    const toolController = new ToolController(toolService);
    console.log("Creating tool routes...");
    const toolRoutes = new ToolRoutes(toolController);
    console.log("Assigning routes to Express...");
    httpServer.addRoutes("/tools", toolRoutes.getRouter());
    console.log("Starting Express application...");
    httpServer.start(5000);
  };
}

Main.start();
