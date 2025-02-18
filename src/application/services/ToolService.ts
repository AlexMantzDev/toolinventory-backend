import Tool from "../../domain/models/Tool";
import ToolDTO from "../dtos/ToolDTO";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import ToolRepository from "../repositories/ToolRepository";
import CRUDService from "./Service";

export default class ToolService implements CRUDService<ToolDTO, ToolEntity> {
  constructor(private toolRepository: ToolRepository) {}

  public create = async (toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.id, toolDTO.name, toolDTO.status);
      await this.toolRepository.save(tool);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (toolId: string, toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.id, toolDTO.name, toolDTO.status);
      await this.toolRepository.update(toolId, tool);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (toolId: string): Promise<void> => {
    try {
      await this.toolRepository.delete(toolId);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findById = async (toolId: string): Promise<ToolEntity> => {
    try {
      const tool: ToolEntity = await this.toolRepository.getById(toolId);
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
      const tools: ToolEntity[] = await this.toolRepository.getAll();
      return tools;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
