import Employee from "../../domain/models/Employee";
import Repository from "../../domain/respository/Repository";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import NotFoundError from "../../error/NotFoundError";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import EmployeeDTO from "../dtos/EmployeeDTO";
import CRUDService from "./Service";

export default class EmployeeService
  implements CRUDService<EmployeeDTO, EmployeeEntity>
{
  constructor(
    private employeeRepository: Repository<Employee, EmployeeEntity>
  ) {}

  public create = async (employeeDTO: EmployeeDTO): Promise<void> => {
    try {
      const employee = new Employee(
        employeeDTO.id,
        employeeDTO.firstName,
        employeeDTO.lastName
      );
      await this.employeeRepository.save(employee);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (
    employeeId: string,
    employeeDTO: EmployeeDTO
  ): Promise<void> => {
    try {
      const employee = new Employee(
        employeeDTO.id,
        employeeDTO.firstName,
        employeeDTO.lastName
      );
      await this.employeeRepository.update(employeeId, employee);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (employeeId: string): Promise<void> => {
    try {
      await this.employeeRepository.delete(employeeId);
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findById = async (employeeId: string): Promise<EmployeeEntity> => {
    try {
      const employee: EmployeeEntity | null =
        await this.employeeRepository.getById(employeeId);
      if (!employee) {
        throw new NotFoundError(
          "Could not find employee with id: " + employeeId
        );
      }
      return employee;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findAll = async (): Promise<EmployeeEntity[]> => {
    try {
      const employees: EmployeeEntity[] =
        await this.employeeRepository.getAll();
      return employees;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
