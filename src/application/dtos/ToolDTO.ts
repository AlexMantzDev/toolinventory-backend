import { ToolStatus, ToolType } from "../../domain/models/Tool";

export default interface ToolDTO {
  code: string;
  name: string;
  status: ToolStatus;
  type: ToolType;
}
