import { ParsedQs } from "qs";
import EmployeeDTO from "../../../application/dtos/EmployeeDTO";
import EmployeeService from "../../../application/services/EmployeeService";
import CustomError from "../../../error/CustomError";
import NotFoundError from "../../../error/NotFoundError";
import EmployeeEntity from "../../persistence/entities/EmployeeEntity";
import { Request, Response } from "express";

export default class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

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
            .json({ message: "Could not find employee with id: " + value });
          return;
        case "codes":
          res
            .status(404)
            .json({ message: "Could not find employee with code: " + value });
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
    const { employee }: { employee: EmployeeDTO } = req.body;
    try {
      await this.employeeService.create(employee);
      res.status(201).json({ message: "Employee added." });
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
    const { employee }: { employee: EmployeeDTO } = req.body;
    const method = req.query.method as string;
    try {
      switch (method) {
        case "ids":
          await this.employeeService.updateById(Number(value), employee);
          break;
        case "codes":
          await this.employeeService.updateByCode(value, employee);
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
      res.status(200).json({ message: "Employee updated." });
    } catch (err) {
      this.handleErrorIdsCodes(res, err, method, value);
    }
  };

  public find = async (req: Request, res: Response) => {
    const { value } = req.params;
    const method = req.query.method as string;
    try {
      let employee: EmployeeEntity;
      switch (method as string) {
        case "ids":
          if (isNaN(Number(value))) {
            throw new CustomError("Provided employee id is not a number.", 400);
          }
          employee = await this.employeeService.findById(Number(value));
          break;
        case "codes":
          employee = await this.employeeService.findByCode(value);
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
      res.status(200).json({ employee });
    } catch (err) {
      this.handleErrorIdsCodes(res, err, method, value);
    }
  };

  public findAll = async (req: Request, res: Response) => {
    const searchMethod = req.query.method as string;
    const searchParam = req.query.param as string;
    try {
      let employees: EmployeeEntity[] = await this.employeeService.findAll();
      switch (searchMethod) {
        case "firstName":
          employees = employees.filter((employee) => {
            return employee.getFirstName() == searchParam;
          });
          break;
        case "lastName":
          employees = employees.filter((employee) => {
            return employee.getLastName() == searchParam;
          });
          break;
        case undefined:
        case null:
        case "":
        default:
          break;
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

  public delete = async (req: Request, res: Response) => {
    const { value } = req.params;
    const method = req.query.method as string;
    try {
      switch (method) {
        case "ids":
          await this.employeeService.deleteById(Number(value));
          break;
        case "codes":
          await this.employeeService.deleteByCode(value);
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
      res.status(200).json({ message: "Employee deleted." });
    } catch (err) {
      this.handleErrorIdsCodes(res, err, method, value);
    }
  };
}
