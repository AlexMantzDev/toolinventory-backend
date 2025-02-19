import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";

export default interface InventoryRepository {
  assignToolToEmployee(employeeId: string, toolId: string): Promise<void>;
  removeToolFromEmployee(employeeId: string, toolId: string): Promise<void>;
  getToolsByEmployee(employeeId: string): Promise<ToolEntity[]>;
  getEmployeeByTool(toolId: string): Promise<EmployeeEntity | null>;
}
