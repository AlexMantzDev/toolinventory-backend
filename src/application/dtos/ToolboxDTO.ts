import { ToolStatus, ToolType } from "../../domain/models/Tool";

export default interface Toolbox {
  code: string;
  name: string;
  status: ToolStatus;
  parentId: number;
  location: string;
}
