import { ToolStatus } from "../../domain/models/Tool";

export default interface ToolDTO {
  id: string;
  name: string;
  status: ToolStatus;
}
