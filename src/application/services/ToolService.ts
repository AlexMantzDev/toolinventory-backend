import ToolRepository from "../../domain/repositories/ToolRepository";
import Tool from "../../domain/models/Tool";
import ToolDTO from "../dtos/ToolDTO";
import NotFoundError from "../../error/NotFoundError";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";

export default class ToolService {
  constructor(private toolRepository: ToolRepository) {}

  public addTool = async (toolDTO: ToolDTO): Promise<void> => {
    const tool = new Tool(toolDTO.id, toolDTO.name);
    await this.toolRepository.save(tool);
    return;
  };

  public updateTool = async (
    ToolId: string,
    ToolDTO: ToolDTO
  ): Promise<void> => {
    try {
      const foundTool = await this.toolRepository.getById(ToolId);
      if (!foundTool) {
        throw new NotFoundError("Could not find tool with id: " + ToolId);
      }
      const newTool = new Tool(ToolDTO.id, ToolDTO.name);
      const promise = await this.toolRepository.update(ToolId, newTool);
      return promise;
    } catch (err) {
      console.error(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public deleteTool = async (toolId: string): Promise<void> => {
    const tool = await this.toolRepository.getById(toolId);
    if (!tool) {
      // TODO: error handling
    }
    await this.toolRepository.delete(toolId);
    return;
  };

  public findTool = async (toolId: string): Promise<Tool> => {
    try {
      const tool = await this.toolRepository.getById(toolId);
      if (!tool) {
        // TODO: error handling
        throw new NotFoundError("Could not find tool with id: " + toolId);
      }
      return tool;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public listAllTools = async (): Promise<Tool[]> => {
    const tools = await this.toolRepository.getAll();
    if (!tools) {
      // TODO: error handling
    }
    return tools;
  };
}
