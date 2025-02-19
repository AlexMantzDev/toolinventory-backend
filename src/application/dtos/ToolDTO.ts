import { ToolStatus } from "../../domain/models/Tool";

export default interface ToolDTO {
  code: string;
  name: string;
  status: ToolStatus;
}
