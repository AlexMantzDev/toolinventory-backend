import ToolRepository from "../../domain/repositories/ToolRepository";
import Tool from "../../domain/models/Tool";
import ToolDTO from "../dtos/ToolDTO";

export default class ToolService {
  constructor(private toolRepository: ToolRepository) {}

  public addTool = async (toolDTO: ToolDTO): Promise<void> => {
    const tool = new Tool(toolDTO.id, toolDTO.name);
    await this.toolRepository.save(tool);
  };

  deleteTool = () => {};

  listTools = () => {};
}
