import Tool from "../../domain/models/Tool";
import ToolDTO from "../dtos/ToolDTO";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import NotFoundError from "../../error/NotFoundError";
import ToolRepository from "../../domain/respository/ToolRepository";
import ToolboxDTO from "../dtos/ToolboxDTO";
import { throwErrs } from "../../lib/utils/throwErrs";
import Toolbox from "../../domain/models/Toolbox";
import CustomError from "../../error/CustomError";

export default class ToolService {
  constructor(private toolRepository: ToolRepository) {}

  public createSingleTool = async (toolDTO: ToolDTO): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name);
      const foundTool = await this.toolRepository.getByCode(toolDTO.code);
      if (foundTool) {
        throw new CustomError(
          "Tool already exists with code: " + tool.getCode(),
          400
        );
      }
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

  public updateById = async (
    toolId: number,
    toolDTO: ToolDTO
  ): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name);
      await this.toolRepository.update(toolId, tool);
    } catch (err) {
      throwErrs(err);
    }
  };

  public updateByCode = async (
    toolCode: string,
    toolDTO: ToolDTO
  ): Promise<void> => {
    try {
      const tool = new Tool(toolDTO.code, toolDTO.name);
      const foundTool = await this.toolRepository.getByCode(toolCode);
      if (!foundTool) {
        throw new NotFoundError("Could not find tool with code: " + toolCode);
      }
      await this.toolRepository.update(foundTool.getId(), tool);
    } catch (err) {
      throwErrs(err);
    }
  };

  public deleteById = async (toolId: number): Promise<void> => {
    try {
      await this.toolRepository.delete(toolId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public deleteByCode = async (toolCode: string): Promise<void> => {
    try {
      const tool = await this.toolRepository.getByCode(toolCode);
      if (!tool) {
        throw new NotFoundError("Could not find tool with code: " + toolCode);
      }
      await this.toolRepository.delete(tool.getId());
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

  public findByCode = async (toolCode: string): Promise<ToolEntity> => {
    try {
      const tool: ToolEntity | null = await this.toolRepository.getByCode(
        toolCode
      );
      if (!tool) {
        throw new NotFoundError("Could not find tool with code: " + toolCode);
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
