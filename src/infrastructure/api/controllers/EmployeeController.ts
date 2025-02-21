import EmployeeDTO from "../../../application/dtos/EmployeeDTO";
import EmployeeService from "../../../application/services/EmployeeService";
import NotFoundError from "../../../error/NotFoundError";
import EmployeeEntity from "../../persistence/entities/EmployeeEntity";
import CRUDController from "./Controller";
import { Request, Response } from "express";

export default class EmployeeController implements CRUDController {
  constructor(private employeeService: EmployeeService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    const { employee }: { employee: EmployeeDTO } = req.body;
    try {
      await this.employeeService.create(employee);
      res.status(201).json({ message: "Employee added." });
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { employee }: { employee: EmployeeDTO } = req.body;
    try {
      await this.employeeService.update(Number(id), employee);
      res.status(200).json({ message: "Employee updated." });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: "Could not find tool with id: " + id });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const employee: EmployeeEntity = await this.employeeService.findById(
        Number(id)
      );
      res.status(200).json({ employee });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res
          .status(404)
          .json({ message: "Could not find employee with id: " + id });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };

  public findAll = async (req: Request, res: Response) => {
    try {
      const employees: EmployeeEntity[] = await this.employeeService.findAll();
      res.status(200).json({ employees });
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await this.employeeService.delete(Number(id));
      res.status(200).json({ message: "Employee deleted." });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res
          .status(404)
          .json({ message: "Could not find employee with id: " + id });
      } else {
        res.status(500).json({ message: "Internal server error." });
      }
    }
  };
}
