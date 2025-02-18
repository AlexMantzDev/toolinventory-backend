import DAO from "../../domain/daos/DAO";
import Employee from "../../domain/models/Employee";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import NotFoundError from "../../error/NotFoundError";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import Repository from "./Repository";

//TODO REMOVE EVERYTHING HERE

export default class EmployeeRepository
  implements Repository<Employee, EmployeeEntity>
{
  constructor(private employeeDAO: DAO<Employee, EmployeeEntity>) {}

  public save = async (employee: Employee): Promise<void> => {
    try {
      await this.employeeDAO.save(employee);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getById = async (id: string): Promise<EmployeeEntity> => {
    try {
      const employee: EmployeeEntity | null = await this.employeeDAO.getById(
        id
      );
      if (!employee) {
        throw new NotFoundError("Could not find employee with id: " + id);
      }
      return employee;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getAll = async (): Promise<EmployeeEntity[]> => {
    try {
      const employees = await this.employeeDAO.getAll();
      return employees;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (id: string, employee: Employee): Promise<void> => {
    try {
      await this.employeeDAO.update(id, employee);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (id: string): Promise<void> => {
    try {
      await this.employeeDAO.delete(id);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
