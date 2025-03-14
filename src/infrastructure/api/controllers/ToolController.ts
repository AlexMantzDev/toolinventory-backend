import { Request, Response } from "express";
import ToolService from "../../../application/services/ToolService";
import ToolDTO from "../../../application/dtos/ToolDTO";
import NotFoundError from "../../../error/NotFoundError";
import ToolEntity from "../../persistence/entities/ToolEntity";
import CustomError from "../../../error/CustomError";

export default class ToolController {
  constructor(private toolService: ToolService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        tool,
        parentId,
        location,
      }: { tool: ToolDTO; parentId?: number; location?: string } = req.body;
      switch (tool.type) {
        case "single": {
          await this.toolService.createSingleTool(tool);
          res.status(201).json({ message: "Tool added." });
          return;
        }
        case "child": {
          if (!parentId || !location) {
            res.status(400).json({
              message:
                "Must provide parent id and location description for child tools.",
            });
            return;
          }
          await this.toolService.createChildTool(tool, parentId, location);
          res.status(200).json({ message: "Tool added." });
          return;
        }
        case "parent": {
          await this.toolService.createParentTool(tool);
          res.status(200).json({ message: "Tool added." });
          return;
        }
        default: {
          res.status(500).json({ message: "Internal server error." });
        }
      }
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const { tool }: { tool: ToolDTO } = req.body;
      await this.toolService.update(Number(id), tool);
      res.status(200).json({ message: "Tool updated." });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: "Could not find tool with id: " + id });
      } else {
        if (err instanceof CustomError) {
          res.status(err.statusCode).json({ message: err.message });
        } else {
          res.status(500).json({ message: "Internal server error." });
        }
      }
    }
  };

  public findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const tool: ToolEntity = await this.toolService.findById(Number(id));
      res.status(200).json({ tool });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: "Could not find tool with id: " + id });
      } else {
        if (err instanceof CustomError) {
          res.status(err.statusCode).json({ message: err.message });
        } else {
          res.status(500).json({ message: "Internal server error." });
        }
      }
    }
  };

  public findAll = async (req: Request, res: Response) => {
    try {
      const tools: ToolEntity[] = await this.toolService.findAll();
      res.status(200).json({ tools });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.toolService.delete(Number(id));
      res.status(200).json({ message: "Tool deleted." });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: "Could not find tool with id: " + id });
      } else {
        if (err instanceof CustomError) {
          res.status(err.statusCode).json({ message: err.message });
        } else {
          res.status(500).json({ message: "Internal server error." });
        }
      }
    }
  };
}
