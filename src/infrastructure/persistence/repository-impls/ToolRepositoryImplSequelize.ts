import Tool from "../../../domain/models/Tool";
import { ToolModel } from "../../sequelize/models";
import InternalServerError from "../../../error/InternalServerError";
import CustomError from "../../../error/CustomError";
import ToolEntity from "../entities/ToolEntity";
import ToolRepository from "../../../domain/respository/ToolRepository";
import Toolbox from "../../../domain/models/Toolbox";

export default class ToolRepositoryImplSequelize implements ToolRepository {
  constructor() {}

  public saveSingleTool = async (tool: Tool): Promise<void> => {
    try {
      await ToolModel.create({
        code: tool.getCode(),
        name: tool.getName(),
        status: tool.getStatus(),
      });
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public saveChildTool = async (tool: Tool): Promise<void> => {
    throw new Error("Not implemented.");
  };

  public saveToolbox = async (toolbox: Toolbox): Promise<void> => {
    throw new Error("Not implemented.");
  };

  public getById = async (id: number): Promise<ToolEntity | null> => {
    try {
      const foundTool: ToolModel | null = await ToolModel.findByPk(id);
      if (!foundTool) {
        return null;
      }
      const tool: ToolEntity = new ToolEntity(
        foundTool.id,
        foundTool.code,
        foundTool.name,
        foundTool.status,
        foundTool.type,
        foundTool.parentId,
        foundTool.location,
        foundTool.createdAt,
        foundTool.updatedAt
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
      foundTools.forEach((foundTool: ToolModel) => {
        const tool = new ToolEntity(
          foundTool.id,
          foundTool.code,
          foundTool.name,
          foundTool.status,
          foundTool.type,
          foundTool.parentId,
          foundTool.location,
          foundTool.createdAt,
          foundTool.updatedAt
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

  public update = async (id: number, tool: Tool): Promise<void> => {
    try {
      const [updatedRows] = await ToolModel.update(tool, { where: { id } });
      //TODO handle case where updating tool => changing code to that of an existing tool's code should fail
      if (updatedRows === 0) {
        throw new CustomError("Update operation did not complete.", 500);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (id: number): Promise<void> => {
    try {
      const rowCount = await ToolModel.destroy({ where: { id } });
      if (rowCount === 0) {
        throw new CustomError("Delete operation did not complete.", 500);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
