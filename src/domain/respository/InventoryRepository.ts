import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";

export default interface InventoryRepository {
  assignToolToEmployeeByIds(employeeId: number, toolId: number): Promise<void>;
  assignToolToEmployeeByCodes(
    employeeCode: string,
    toolCode: string
  ): Promise<void>;
  removeToolFromEmployeeByIds(
    employeeId: number,
    toolId: number
  ): Promise<void>;
  removeToolFromEmployeeByCodes(
    employeeCode: string,
    toolCode: string
  ): Promise<void>;
  getToolsByEmployeeId(employeeId: number): Promise<ToolEntity[]>;
  getToolsByEmployeeCode(employeeCode: string): Promise<ToolEntity[]>;
  getEmployeeByToolId(toolId: number): Promise<EmployeeEntity | null>;
  getEmployeeByToolCode(toolCode: string): Promise<EmployeeEntity | null>;
}
