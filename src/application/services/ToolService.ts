import Tool from "../../domain/models/Tool";
import ToolDTO from "../dtos/ToolDTO";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import NotFoundError from "../../error/NotFoundError";
import ToolRepository from "../../domain/respository/ToolRepository";
import ToolboxDTO from "../dtos/ToolboxDTO";
import { throwErrs } from "../../lib/utils/throwErrs";
import Toolbox from "../../domain/models/Toolbox";

export default class ToolService {
  constructor(private toolRepository: ToolRepository) {}

  public createSingleTool = async (toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name);
      await this.toolRepository.saveSingleTool(tool);
    } catch (err) {
      throwErrs(err);
    }
  };

  public createChildTool = async (
    toolDTO: ToolDTO,
    parentId: number,
    location: string
  ): Promise<void> => {
    try {
      const tool = new Tool(
        toolDTO.code,
        toolDTO.name,
        parentId,
        location,
        "child"
      );
      await this.toolRepository.saveChildTool(tool);
    } catch (err) {
      throwErrs(err);
    }
  };

  public createParentTool = async (toolboxDTO: ToolboxDTO): Promise<void> => {
    try {
      const toolbox = new Toolbox(toolboxDTO.code, toolboxDTO.name);
      await this.toolRepository.saveToolbox(toolbox);
    } catch (err) {
      throwErrs(err);
    }
  };

  public update = async (toolId: number, toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name);
      await this.toolRepository.update(toolId, tool);
    } catch (err) {
      throwErrs(err);
    }
  };

  public delete = async (toolId: number): Promise<void> => {
    try {
      await this.toolRepository.delete(toolId);
    } catch (err) {
      throwErrs(err);
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
      throwErrs(err);
    }
  };

  public findAll = async (): Promise<ToolEntity[]> => {
    try {
      return await this.toolRepository.getAll();
    } catch (err) {
      throwErrs(err);
    }
  };
}
