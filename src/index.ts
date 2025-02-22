import ToolService from "./application/services/ToolService";
import ToolController from "./infrastructure/api/controllers/ToolController";
import { httpServer } from "./infrastructure/api";
import ToolRoutes from "./infrastructure/api/routes/ToolRoutes";
import { json } from "express";
import ToolRepositoryImplSequelize from "./infrastructure/persistence/repository-impls/ToolRepositoryImplSequelize";
import EmployeeRoutes from "./infrastructure/api/routes/EmployeeRoutes";
import EmployeeController from "./infrastructure/api/controllers/EmployeeController";
import EmployeeService from "./application/services/EmployeeService";
import EmployeeRepositoryImplSequelize from "./infrastructure/persistence/repository-impls/EmployeeRepositoryImplSequelize";
import InventoryController from "./infrastructure/api/controllers/InventoryController";
import InventoryService from "./application/services/InventoryService";
import InventoryRepositoryImplSequelize from "./infrastructure/persistence/repository-impls/InventoryRepositoryImplSequelize";
import InventoryRoutes from "./infrastructure/api/routes/InventoryRoutes";
import AuthRoutes from "./infrastructure/api/routes/AuthRoutes";
import AuthController from "./infrastructure/api/controllers/AuthController";
import AuthService from "./application/services/AuthService";
import UserRepositoryImplSequelize from "./infrastructure/persistence/repository-impls/UserRepositoryImplSequelize";
import RefreshTokenRepositoryImplSequelize from "./infrastructure/persistence/repository-impls/RefreshTokenRepositoryImplSequelize";
import RefreshTokenService from "./application/services/RefreshTokenService";
import cookieParser from "cookie-parser";
import AccessTokenService from "./application/services/AccessTokenService";

class Main {
  private constructor() {}

  static start = () => {
    new Main();
    console.log("Creating tool repository implementation...");
    const toolRepository = new ToolRepositoryImplSequelize();
    console.log("Creating tool service...");
    const toolService = new ToolService(toolRepository);
    console.log("Creating tool controller...");
    const toolController = new ToolController(toolService);
    console.log("Creating tool routes...");
    const toolRoutes = new ToolRoutes(toolController);
    console.log("Creating employee repository implementation...");
    const employeeRepository = new EmployeeRepositoryImplSequelize();
    console.log("Creating employee service...");
    const employeeService = new EmployeeService(employeeRepository);
    console.log("Creating employee controller...");
    const employeeController = new EmployeeController(employeeService);
    console.log("Creating employee routes...");
    const employeeRoutes = new EmployeeRoutes(employeeController);
    console.log("Setting up middleware...");

    const inventoryRepository = new InventoryRepositoryImplSequelize();
    const inventoryService = new InventoryService(inventoryRepository);
    const inventoryController = new InventoryController(inventoryService);
    const inventoryRoutes = new InventoryRoutes(inventoryController);
    const userRepository = new UserRepositoryImplSequelize();
    const refreshTokenRepository = new RefreshTokenRepositoryImplSequelize();
    const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
    const accessTokenService = new AccessTokenService(userRepository);
    const authService = new AuthService(
      userRepository,
      refreshTokenService,
      accessTokenService
    );
    const authController = new AuthController(
      authService,
      refreshTokenService,
      accessTokenService
    );
    const authRoutes = new AuthRoutes(authController);
    httpServer.addMiddleware(cookieParser());
    httpServer.addMiddleware(json());
    console.log("Assigning routes to Express...");
    httpServer.addRoutes("/api/v1/auth", authRoutes.router);
    httpServer.addRoutes("/api/v1/inventory", inventoryRoutes.router);
    httpServer.addRoutes("/api/v1/tools", toolRoutes.router);
    httpServer.addRoutes("/api/v1/employees", employeeRoutes.router);
    console.log("Starting Express application...");
    httpServer.start(5000);
  };
}

Main.start();
