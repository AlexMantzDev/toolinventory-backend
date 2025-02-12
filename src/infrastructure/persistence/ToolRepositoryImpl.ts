import ToolRepository from "../../domain/repositories/ToolRepository";
import Tool from "../../domain/models/Tool";
import ToolModel from "../sequelize/models/ToolModel";
import NotFoundError from "../../error/NotFoundError";
import InternalServerError from "../../error/InternalServerError";
import CustomError from "../../error/CustomError";

export default class ToolRepositoryImpl implements ToolRepository {
  constructor() {}

  async save(tool: Tool): Promise<void> {
    try {
      await ToolModel.create({ tool });
    } catch (err) {
      console.error(err);
      throw new InternalServerError("Internal server error.");
    }
  }

  async getById(id: string): Promise<Tool | null> {
    try {
      const foundTool = await ToolModel.findByPk(id);
      if (!foundTool) {
        throw new NotFoundError("Could not find Tool with id: " + id);
      }
      const tool = new Tool(foundTool?.id, foundTool?.name);
      return tool;
    } catch (err) {
      console.error(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  }

  async getAll(): Promise<Tool[]> {
    try {
      const foundTools = await ToolModel.findAll();
      const tools: Tool[] = [];
      if (!foundTools) return tools;
      foundTools.forEach((e: ToolModel) => {
        const tool = new Tool(e?.id, e?.name);
        tools.push(tool);
      });
      return tools;
    } catch (err) {
      console.error(err);
      throw new InternalServerError("Internal server error.");
    }
  }

  async update(id: string, tool: Tool): Promise<void> {
    try {
      const foundTool = await ToolModel.findByPk(id);
      if (!foundTool) {
        throw new NotFoundError("Could not find tool with id: " + id);
      }
      await ToolModel.update(tool, { where: { id } });
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  }

  async delete(id: string): Promise<void> {}
}
