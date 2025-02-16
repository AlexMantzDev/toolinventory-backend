import DAO from "../../domain/daos/DAO";
import Tool from "../../domain/models/Tool";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import NotFoundError from "../../error/NotFoundError";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import Repository from "./Repository";

export default class ToolRepository implements Repository<Tool, ToolEntity> {
  constructor(private toolDAO: DAO<Tool, ToolEntity>) {}

  public save = async (tool: Tool): Promise<void> => {
    try {
      await this.toolDAO.save(tool);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getById = async (id: string): Promise<ToolEntity> => {
    try {
      const tool: ToolEntity | null = await this.toolDAO.getById(id);
      if (!tool) {
        throw new NotFoundError("Could not find tool with id: " + id);
      }
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
      const tools = await this.toolDAO.getAll();
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
      await this.toolDAO.update(id, tool);
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
      await this.toolDAO.delete(id);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
