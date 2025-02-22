import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import Tool from "../models/Tool";

export default interface ToolRepository {
  save(tool: Tool): Promise<void>;
  getById(id: number): Promise<ToolEntity | null>;
  getAll(): Promise<ToolEntity[]>;
  update(id: number, tool: Tool): Promise<void>;
  delete(id: number): Promise<void>;
}
