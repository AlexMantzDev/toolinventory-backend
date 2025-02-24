import Tool from "../../domain/models/Tool";
import ToolDTO from "../dtos/ToolDTO";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import NotFoundError from "../../error/NotFoundError";
import ToolRepository from "../../domain/respository/ToolRepository";
import ToolboxDTO from "../dtos/ToolboxDTO";

export default class ToolService {
  constructor(private toolRepository: ToolRepository) {}

  public createSingleTool = async (toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name, toolDTO.status);
      await this.toolRepository.saveSingleTool(tool);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public createChildTool = async (toolDTO: ToolDTO): Promise<void> => {
    throw new Error("Not implemented.");
  };

  public createToolbox = async (toolboxDTO: ToolboxDTO): Promise<void> => {
    throw new Error("Not implemented.");
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
