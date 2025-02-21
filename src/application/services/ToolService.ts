import Tool from "../../domain/models/Tool";
import ToolDTO from "../dtos/ToolDTO";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import CRUDService from "./Service";
import CRUDRepository from "../../domain/respository/CRUDRepository";
import NotFoundError from "../../error/NotFoundError";

export default class ToolService implements CRUDService<ToolDTO, ToolEntity> {
  constructor(private toolRepository: CRUDRepository<Tool, ToolEntity>) {}

  public create = async (toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name, toolDTO.status);
      await this.toolRepository.save(tool);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (toolId: number, toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name, toolDTO.status);
      await this.toolRepository.update(toolId, tool);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (toolId: number): Promise<void> => {
    try {
      await this.toolRepository.delete(toolId);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findById = async (toolId: number): Promise<ToolEntity> => {
    try {
      const tool: ToolEntity | null = await this.toolRepository.getById(toolId);
      if (!tool) {
        throw new NotFoundError("Could not find tool wit id: " + toolId);
      }
      return tool;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findAll = async (): Promise<ToolEntity[]> => {
    try {
      return await this.toolRepository.getAll();
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
