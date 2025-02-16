import Tool from "../../../domain/models/Tool";
import ToolModel from "../../sequelize/models/ToolModel";
import NotFoundError from "../../../error/NotFoundError";
import InternalServerError from "../../../error/InternalServerError";
import CustomError from "../../../error/CustomError";
import ToolEntity from "../entities/ToolEntity";
import DAO from "../../../domain/daos/DAO";

export default class ToolDAOImplSequelize implements DAO<Tool, ToolEntity> {
  constructor() {}

  async save(tool: Tool): Promise<void> {
    try {
      const newTool: ToolModel = await ToolModel.create({
        id: tool.getId(),
        name: tool.getName(),
        status: tool.getStatus(),
      });
      if (!newTool) {
        throw new CustomError("could not create new tool.", 500);
      }
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  }

  async getById(id: string): Promise<ToolEntity | null> {
    try {
      const foundTool: ToolModel | null = await ToolModel.findByPk(id);
      if (!foundTool) {
        return null;
      }
      const tool = new ToolEntity(
        foundTool?.id,
        foundTool?.name,
        foundTool?.status,
        foundTool?.createdAt,
        foundTool?.updatedAt
      );
      return tool;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  }

  async getAll(): Promise<ToolEntity[]> {
    try {
      const foundTools: ToolModel[] = await ToolModel.findAll();
      const tools: ToolEntity[] = [];
      if (!foundTools) return tools;
      foundTools.forEach((e: ToolModel) => {
        const tool = new ToolEntity(
          e?.id,
          e?.name,
          e?.status,
          e?.createdAt,
          e?.updatedAt
        );
        tools.push(tool);
      });
      return tools;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  }

  async update(id: string, tool: Tool): Promise<void> {
    try {
      const foundTool: ToolModel | null = await ToolModel.findByPk(id);
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

  async delete(id: string): Promise<void> {
    try {
      const deletedCount = await ToolModel.destroy({ where: { id } });
      if (deletedCount === 0) {
        throw new NotFoundError("Could not find tool with id: " + id);
      }
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  }
}
