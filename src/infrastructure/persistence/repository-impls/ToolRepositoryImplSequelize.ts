import Tool from "../../../domain/models/Tool";
import { ToolModel } from "../../sequelize/models";
import NotFoundError from "../../../error/NotFoundError";
import InternalServerError from "../../../error/InternalServerError";
import CustomError from "../../../error/CustomError";
import ToolEntity from "../entities/ToolEntity";
import Repository from "../../../domain/respository/Repository";

export default class ToolRepositoryImplSequelize
  implements Repository<Tool, ToolEntity>
{
  constructor() {}

  public save = async (tool: Tool): Promise<void> => {
    try {
      await ToolModel.create({
        id: tool.getId(),
        name: tool.getName(),
        status: tool.getStatus(),
      });
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getById = async (id: string): Promise<ToolEntity | null> => {
    try {
      const foundTool: ToolModel | null = await ToolModel.findByPk(id);
      if (!foundTool) {
        return null;
      }
      const tool: ToolEntity = new ToolEntity(
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
  };

  public getAll = async (): Promise<ToolEntity[]> => {
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
  };

  public update = async (id: string, tool: Tool): Promise<void> => {
    try {
      const [updatedRows] = await ToolModel.update(tool, { where: { id } });
      if (updatedRows === 0) {
        throw new NotFoundError("Could not find tool with id: " + id);
      }
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (id: string): Promise<void> => {
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
  };
}
