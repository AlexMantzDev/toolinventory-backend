import { Request, Response } from "express";
import ToolService from "../../../application/services/ToolService";
import ToolRepositoryImple from "../../persistence/ToolRepositoryImpl";

export default class ToolController {
  constructor(private toolService: ToolService) {}

  addTool = async (req: Request, res: Response) => {
    const { tool } = req.body;
    await this.toolService.addTool(tool);
    res.status(201).json({ message: "Tool added." });
  };
}
