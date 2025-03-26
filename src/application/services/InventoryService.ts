import CustomError from "../../error/CustomError";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import InventoryRepository from "../../infrastructure/persistence/repository-impls/InventoryRepositoryImplSequelize";
import { throwErrs } from "../../lib/utils/throwErrs";

export default class InventoryService {
  constructor(private inventoryRepository: InventoryRepository) {}

  public checkoutToolByIds = async (
    employeeId: number,
    toolId: number
  ): Promise<void> => {
    try {
      const assignedEmployee =
        await this.inventoryRepository.getEmployeeByToolId(toolId);
      if (assignedEmployee !== null) {
        throw new CustomError("Tool is already checked out.", 409);
      }
      await this.inventoryRepository.assignToolToEmployeeByIds(
        employeeId,
        toolId
      );
    } catch (err) {
      throwErrs(err);
    }
  };

  public checkoutToolsByCodes = async (
    employeeCode: string,
    toolCode: string
  ): Promise<void> => {
    try {
      const assignedEmployee =
        await this.inventoryRepository.getEmployeeByToolCode(toolCode);
      if (assignedEmployee !== null) {
        throw new CustomError("Tool is already checked out.", 409);
      }
      await this.inventoryRepository.assignToolToEmployeeByCodes(
        employeeCode,
        toolCode
      );
    } catch (err) {
      throwErrs(err);
    }
  };

  public returnToolFromEmployeeByIds = async (
    employeeId: number,
    toolId: number
  ): Promise<void> => {
    try {
      await this.inventoryRepository.removeToolFromEmployeeByIds(
        employeeId,
        toolId
      );
    } catch (err) {
      throwErrs(err);
    }
  };

  public returnToolFromEmployeeByCodes = async (
    employeeCode: string,
    toolCode: string
  ): Promise<void> => {
    try {
      await this.inventoryRepository.removeToolFromEmployeeByCodes(
        employeeCode,
        toolCode
      );
    } catch (err) {
      throwErrs(err);
    }
  };

  public getToolsByEmployeeId = async (
    employeeId: number
  ): Promise<ToolEntity[]> => {
    try {
      return await this.inventoryRepository.getToolsByEmployeeId(employeeId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public getToolsByEmployeeCode = async (
    employeeCode: string
  ): Promise<ToolEntity[]> => {
    try {
      return await this.inventoryRepository.getToolsByEmployeeCode(
        employeeCode
      );
    } catch (err) {
      throwErrs(err);
    }
  };

  public getEmployeeByToolId = async (
    toolId: number
  ): Promise<EmployeeEntity | null> => {
    try {
      return await this.inventoryRepository.getEmployeeByToolId(toolId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public getEmployeeByToolCode = async (
    toolCode: string
  ): Promise<EmployeeEntity | null> => {
    try {
      return await this.inventoryRepository.getEmployeeByToolCode(toolCode);
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAllEmployeesWithTools = async (): Promise<
    EmployeeEntity[] | null
  > => {
    try {
      return await this.inventoryRepository.getAllEmployeesWithTools();
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAllToolsCheckedOut = async (): Promise<ToolEntity[] | null> => {
    try {
      return await this.inventoryRepository.getAllToolsIssued();
    } catch (err) {
      throwErrs(err);
    }
  };
}
