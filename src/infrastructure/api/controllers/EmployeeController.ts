import EmployeeDTO from "../../../application/dtos/EmployeeDTO";
import EmployeeService from "../../../application/services/EmployeeService";
import NotFoundError from "../../../error/NotFoundError";
import EmployeeEntity from "../../persistence/entities/EmployeeEntity";
import Controller from "./Controller";
import { Request, Response } from "express";

export default class EmployeeController implements Controller {
  constructor(private employeeService: EmployeeService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { employee }: { employee: EmployeeDTO } = req.body;
      await this.employeeService.create(employee);
      res.status(201).json({ message: "Employee added." });
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const { employee }: { employee: EmployeeDTO } = req.body;
      await this.employeeService.update(id, employee);
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
      const employee: EmployeeEntity = await this.employeeService.findById(id);
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
      await this.employeeService.delete(id);
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
