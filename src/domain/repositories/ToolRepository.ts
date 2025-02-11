import Tool from "../models/Tool";

export default interface ToolRepository {
  save(tool: Tool): Promise<void>;
  getById(id: string): Promise<Tool | null>;
  getAll(): Promise<Tool[]>;
  update(tool: Tool): Promise<void>;
  delete(id: string): Promise<void>;
}
