import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import Tool from "../models/Tool";

export default interface ToolRepository {
  save(tool: Tool): Promise<void>;
  getById(id: string): Promise<ToolEntity | null>;
  getAll(): Promise<ToolEntity[]>;
  update(id: string, tool: Tool): Promise<void>;
  delete(id: string): Promise<void>;
}
