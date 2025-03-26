import { Request, Response } from "express";
import InventoryService from "../../../application/services/InventoryService";
import ToolEntity from "../../persistence/entities/ToolEntity";
import EmployeeEntity from "../../persistence/entities/EmployeeEntity";
import CustomError from "../../../error/CustomError";

export default class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  public checkoutTool = async (req: Request, res: Response): Promise<void> => {
    const method = req.query.method;
    try {
      switch (method) {
        case "ids":
          await this.checkoutToolByIds(req, res);
          break;
        case "codes":
          await this.checkoutToolByCodes(req, res);
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
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  private checkoutToolByIds = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { employeeId, toolId }: { employeeId: string; toolId: string } =
      req.body;
    await this.inventoryService.checkoutToolByIds(
      Number(employeeId),
      Number(toolId)
    );
    res.status(200).json({
      message: `Tool ${toolId} checked out to employee ${employeeId}.`,
    });
  };

  private checkoutToolByCodes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const {
      employeeCode,
      toolCode,
    }: { employeeCode: string; toolCode: string } = req.body;
    await this.inventoryService.checkoutToolsByCodes(employeeCode, toolCode);
    res.status(200).json({
      message: `Tool ${toolCode} checked out to employee ${employeeCode}.`,
    });
  };

  public returnTool = async (req: Request, res: Response): Promise<void> => {
    const method = req.query.method;
    try {
      switch (method) {
        case "ids":
          await this.returnToolByIds(req, res);
          break;
        case "codes":
          await this.returnToolByCodes(req, res);
          break;
        case undefined:
        case null:
        case "":
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
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  private returnToolByIds = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { employeeId, toolId }: { employeeId: string; toolId: string } =
      req.body;
    await this.inventoryService.returnToolFromEmployeeByIds(
      Number(employeeId),
      Number(toolId)
    );
    res.status(200).json({
      message: `Tool ${toolId} returned from employee ${employeeId}.`,
    });
  };

  private returnToolByCodes = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const {
      employeeCode,
      toolCode,
    }: { employeeCode: string; toolCode: string } = req.body;
    await this.inventoryService.returnToolFromEmployeeByCodes(
      employeeCode,
      toolCode
    );
    res.status(200).json({
      message: `Tool ${toolCode} returned from employee ${employeeCode}.`,
    });
  };

  public getToolsByEmployee = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const method = req.query.method;
    let tools: ToolEntity[];
    try {
      switch (method) {
        case "ids":
          tools = await this.getToolsByEmployeeId(req);
          break;
        case "codes":
          tools = await this.getToolsByEmployeeCode(req);
          break;
        case undefined:
        case null:
        case "":
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
      res.status(200).json({ tools });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  private getToolsByEmployeeId = async (
    req: Request
  ): Promise<ToolEntity[]> => {
    const { value } = req.params;
    if (isNaN(Number(value))) {
      throw new CustomError("Provided employee id is not a number.", 400);
    }
    return this.inventoryService.getToolsByEmployeeId(Number(value));
  };

  private getToolsByEmployeeCode = async (
    req: Request
  ): Promise<ToolEntity[]> => {
    const { value } = req.params;
    return this.inventoryService.getToolsByEmployeeCode(value);
  };

  public getEmployeeByTool = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const method = req.query.method;
    let employees: EmployeeEntity | null;
    try {
      switch (method) {
        case "ids":
          employees = await this.getEmployeeByToolId(req);
          break;
        case "codes":
          employees = await this.getEmployeeByToolCode(req);
          break;
        case undefined:
        case null:
        case "":
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
      res.status(200).json({ employees });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  private getEmployeeByToolId = async (
    req: Request
  ): Promise<EmployeeEntity | null> => {
    const { value } = req.params;
    if (isNaN(Number(value))) {
      throw new CustomError("Provided tool id is not a number.", 400);
    }
    console.log(value);
    return this.inventoryService.getEmployeeByToolId(Number(value));
  };

  private getEmployeeByToolCode = async (
    req: Request
  ): Promise<EmployeeEntity | null> => {
    const { value } = req.params;
    return this.inventoryService.getEmployeeByToolCode(value);
  };

  public getAllCheckedOutTools = async (req: Request, res: Response) => {
    try {
      const tools: ToolEntity[] | null =
        await this.inventoryService.getAllToolsCheckedOut();
      if (!tools) {
        res
          .status(404)
          .json({ message: "Could not find any tools checked out." });
      }
      res.status(200).json({ tools });
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  public getAllEmployeesWithTools = async (req: Request, res: Response) => {
    try {
      const employees: EmployeeEntity[] | null =
        await this.inventoryService.getAllEmployeesWithTools();
      if (!employees) {
        res
          .status(404)
          .json({ message: "Could not find any employees with tools issued." });
      }
      res.status(200).json({ employees });
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  };
}
