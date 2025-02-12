import { Request, Response } from "express";
import ToolService from "../../../application/services/ToolService";

export default class ToolController {
  constructor(private toolService: ToolService) {}

  public addTool = async (req: Request, res: Response) => {
    try {
      const { tool } = req.body;
      await this.toolService.addTool(tool);
      res.status(201).json({ message: "Tool added." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  public getAllTools = async (req: Request, res: Response) => {
    try {
      const tools = await this.toolService.listAllTools();
      res.status(200).json(tools);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
}
