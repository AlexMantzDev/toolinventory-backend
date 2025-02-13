import Employee from "../../domain/models/Employee";
import Tool from "../../domain/models/Tool";

export default class InventoryService {
  constructor() {}

  issueToolToEmployee = (employee: Employee, tool: Tool): void => {};

  returnToolFromEmployee = (employee: Employee, tool: Tool): void => {};
}
