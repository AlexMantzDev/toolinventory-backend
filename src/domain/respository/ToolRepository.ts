import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import Tool from "../models/Tool";
import Toolbox from "../models/Toolbox";

export default interface ToolRepository {
  saveSingleTool(tool: Tool): Promise<void>;
  saveChildTool(tool: Tool): Promise<void>;
  saveToolbox(toolbox: Toolbox): Promise<void>;
  getById(id: number): Promise<ToolEntity | null>;
  getByCode(code: string): Promise<ToolEntity | null>;
  getAll(): Promise<ToolEntity[]>;
  update(id: number, tool: Tool): Promise<void>;
  delete(id: number): Promise<void>;
}
