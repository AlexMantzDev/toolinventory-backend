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
      await this.inventoryService.checkoutTool(employeeId, toolId);
      res
        .status(200)
        .send(`Tool ${toolId} checked out to employee ${employeeId}.`);
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Internal server error." });
      }
    }
  };

  public return = async (req: Request, res: Response): Promise<void> => {
    const { employeeId, toolId }: { employeeId: string; toolId: string } =
      req.body;
    try {
      await this.inventoryService.returnTool(employeeId, toolId);
      res
        .status(200)
        .send(`Tool ${toolId} returned from employee ${employeeId}.`);
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Internal server error." });
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
        await this.inventoryService.getToolsByEmployee(employeeId);
      res.status(200).send({ tools });
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
        await this.inventoryService.getEmployeeByTool(toolId);
      res.status(200).send({ employee });
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
          .send({ message: "Could not find any tools checked out." });
      }
      res.status(200).send({ tools });
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
          .send({ message: "Could not find any employees with tools issued." });
      }
      res.status(200).send({ employees });
    } catch (err) {
      console.log(err);
    }
  };
}
