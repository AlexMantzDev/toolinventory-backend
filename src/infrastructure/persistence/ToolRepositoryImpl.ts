import ToolRepository from "../../domain/repositories/ToolRepository";
import Tool from "../../domain/models/Tool";

export default class ToolRepositoryImpl implements ToolRepository {
  constructor() {}

  async save(tool: Tool): Promise<void> {}

  async getById(id: string): Promise<Tool | null> {}

  async getAll(): Promise<Tool[]> {}

  async update(tool: Tool): Promise<void> {}

  async delete(id: string): Promise<void> {}
}
