import { Request, Response } from "express";
import InventoryService from "../../../application/services/InventoryService";
import ToolEntity from "../../persistence/entities/ToolEntity";
import EmployeeEntity from "../../persistence/entities/EmployeeEntity";
import CustomError from "../../../error/CustomError";

export default class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  public checkout = async (req: Request, res: Response): Promise<void> => {
    const { employeeId, toolId }: { employeeId: string; toolId: string } =
      req.body;
    try {
      await this.inventoryService.checkoutTool(
        Number(employeeId),
        Number(toolId)
      );
      res.status(200).json({
        message: `Tool ${toolId} checked out to employee ${employeeId}.`,
      });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public return = async (req: Request, res: Response): Promise<void> => {
    const { employeeId, toolId }: { employeeId: string; toolId: string } =
      req.body;
    try {
      await this.inventoryService.returnTool(
        Number(employeeId),
        Number(toolId)
      );
      res.status(200).json({
        message: `Tool ${toolId} returned from employee ${employeeId}.`,
      });
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public getToolsByEmployee = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { employeeId } = req.params;
    try {
      const tools: ToolEntity[] =
        await this.inventoryService.getToolsByEmployee(Number(employeeId));
      res.status(200).json({ tools });
    } catch (err) {
      console.log(err);
    }
  };

  public getEmployeeByTool = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { toolId } = req.params;
    try {
      const employee: EmployeeEntity | null =
        await this.inventoryService.getEmployeeByTool(Number(toolId));
      res.status(200).json({ employee });
    } catch (err) {
      console.log(err);
    }
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
      console.log(err);
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
      console.log(err);
    }
  };
}
