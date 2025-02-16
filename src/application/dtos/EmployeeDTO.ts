import Tool from "../../domain/models/Tool";

export default interface EmployeeDTO {
  id: string;
  firstName: string;
  lastName: string;
  tools: Tool[];
}
