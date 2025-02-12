import { Request, Response } from "express";
import ToolService from "../../../application/services/ToolService";
import ToolDTO from "../../../application/dtos/ToolDTO";
import NotFoundError from "../../../error/NotFoundError";
import ToolEntity from "../../persistence/entities/ToolEntity";

export default class ToolController {
  constructor(private toolService: ToolService) {}

  public addTool = async (req: Request, res: Response) => {
    try {
      const { tool }: { tool: ToolDTO } = req.body;
      await this.toolService.addTool(tool);
      res.status(201).json({ message: "Tool added." });
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  public updateTool = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { tool }: { tool: ToolDTO } = req.body;
      await this.toolService.updateTool(id, tool);
      res.status(200).json({ message: "Tool updated." });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: "Could not find tool with id: " + id });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public getToolById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const tool: ToolEntity = await this.toolService.findTool(id);
      res.status(200).json({ tool });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: "Could not find tool with id: " + id });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public getAllTools = async (req: Request, res: Response) => {
    try {
      const tools: ToolEntity[] = await this.toolService.listAllTools();
      res.status(200).json({ tools });
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  public deleteToolById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.toolService.deleteTool(id);
      res.status(200).json({ message: "Tool deleted." });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: "Could not find tool with id: " + id });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };
}
