import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";

export default interface InventoryRepository {
  assignToolToEmployee(employeeId: number, toolId: number): Promise<void>;
  removeToolFromEmployee(employeeId: number, toolId: number): Promise<void>;
  getToolsByEmployee(employeeId: number): Promise<ToolEntity[]>;
  getEmployeeByTool(toolId: number): Promise<EmployeeEntity | null>;
}
