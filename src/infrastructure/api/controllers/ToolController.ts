import { Request, Response } from "express";
import ToolService from "../../../application/services/ToolService";
import ToolDTO from "../../../application/dtos/ToolDTO";
import NotFoundError from "../../../error/NotFoundError";
import ToolEntity from "../../persistence/entities/ToolEntity";
import CustomError from "../../../error/CustomError";

export default class ToolController {
  constructor(private toolService: ToolService) {}

  private handleErrorIdsCodes(
    res: Response,
    err: unknown,
    method: string,
    value: string
  ) {
    if (err instanceof NotFoundError) {
      switch (method) {
        case "ids":
          res
            .status(404)
            .json({ message: "Could not find tool with id: " + value });
          return;
        case "codes":
          res
            .status(404)
            .json({ message: "Could not find tool with code: " + value });
          return;
        case undefined:
        case null:
        case "":
        default:
          break;
      }
    }
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal server error." });
    }
  }

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
    const { value } = req.params;
    const { tool }: { tool: ToolDTO } = req.body;
    const method = req.query.method as string;
    try {
      switch (method) {
        case "ids":
          if (isNaN(Number(value))) {
            throw new CustomError("Provided employee id is not a number.", 400);
          }
          await this.toolService.updateById(Number(value), tool);
          break;
        case "codes":
          await this.toolService.updateByCode(value, tool);
          break;
        case undefined:
        case null:
        case "":
          res.status(400).json({
            message:
              "Query param unsupported. Please include query param method=ids or codes.",
          });
          return;
        default:
          res.status(400).json({
            message: "Please include query param method=ids or codes.",
          });
          return;
      }
      res.status(200).json({ message: "Tool updated." });
    } catch (err) {
      this.handleErrorIdsCodes(res, err, method, value);
    }
  };

  public find = async (req: Request, res: Response) => {
    const { value } = req.params;
    const method = req.query.method as string;
    try {
      let tool: ToolEntity;
      switch (method) {
        case "ids":
          if (isNaN(Number(value))) {
            throw new CustomError("Provided employee id is not a number.", 400);
          }
          tool = await this.toolService.findById(Number(value));
          break;
        case "codes":
          tool = await this.toolService.findByCode(value);
          break;
        case undefined:
        case null:
        case "":
          res.status(400).json({
            message:
              "Query param unsupported. Please include query param method=ids or codes.",
          });
          return;
        default:
          res.status(400).json({
            message: "Please include query param method=ids or codes.",
          });
          return;
      }
      res.status(200).json({ tool });
    } catch (err) {
      this.handleErrorIdsCodes(res, err, method, value);
    }
  };

  public findAll = async (req: Request, res: Response) => {
    const searchMethod = req.query.method as string;
    const searchParam = req.query.param as string;
    try {
      let tools: ToolEntity[] = await this.toolService.findAll();
      switch (searchMethod) {
        case "name":
          tools = tools.filter((tool) => {
            return tool
              .getName()
              .toLowerCase()
              .includes(searchParam.toLowerCase());
          });
          break;
        case "status":
          tools = tools.filter((tool) => {
            return tool.getStatus() === searchParam;
          });
          break;
        case "type":
          tools = tools.filter((tool) => {
            return tool.getType() === searchParam;
          });
          break;
        case "parentId":
          const parentId = Number(searchParam);
          if (!isNaN(parentId)) {
            tools = tools.filter((tool) => {
              return tool.getParentId() === parentId;
            });
          } else {
            res.status(400).json({ message: "Invalid parentId parameter." });
            return;
          }
          break;
        case undefined:
        case null:
        case "":
          break;
        default:
          res.status(400).json({ message: "Invalid search method." });
          return;
      }
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
    const { value } = req.params;
    const method = req.query.method as string;
    try {
      switch (method) {
        case "ids":
          await this.toolService.deleteById(Number(value));
          break;
        case "codes":
          await this.toolService.deleteByCode(value);
          break;
        case undefined:
        case null:
        case "":
          res.status(400).json({
            message:
              "Query param unsupported. Please include query param method=ids or codes.",
          });
          return;
        default:
          res.status(400).json({
            message: "Please include query param method=ids or codes.",
          });
          return;
      }
      res.status(200).json({ message: "Tool deleted." });
    } catch (err) {
      this.handleErrorIdsCodes(res, err, method, value);
    }
  };
}
