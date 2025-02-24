import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import InventoryRepository from "../../infrastructure/persistence/repository-impls/InventoryRepositoryImplSequelize";

export default class InventoryService {
  constructor(private inventoryRepository: InventoryRepository) {}

  public checkoutTool = async (
    employeeId: number,
    toolId: number
  ): Promise<void> => {
    try {
      const assignedEmployee = await this.inventoryRepository.getEmployeeByTool(
        toolId
      );
      if (assignedEmployee !== null) {
        throw new CustomError("Tool is already checked out.", 409);
      }
      await this.inventoryRepository.assignToolToEmployee(employeeId, toolId);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public returnTool = async (
    employeeId: number,
    toolId: number
  ): Promise<void> => {
    try {
      await this.inventoryRepository.removeToolFromEmployee(employeeId, toolId);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getToolsByEmployee = async (
    employeeId: number
  ): Promise<ToolEntity[]> => {
    try {
      return await this.inventoryRepository.getToolsByEmployee(employeeId);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getEmployeeByTool = async (
    toolId: number
  ): Promise<EmployeeEntity | null> => {
    try {
      return await this.inventoryRepository.getEmployeeByTool(toolId);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getAllEmployeesWithTools = async (): Promise<
    EmployeeEntity[] | null
  > => {
    try {
      return await this.inventoryRepository.getAllEmployeesWithTools();
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getAllToolsCheckedOut = async (): Promise<ToolEntity[] | null> => {
    try {
      return await this.inventoryRepository.getAllToolsIssued();
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
