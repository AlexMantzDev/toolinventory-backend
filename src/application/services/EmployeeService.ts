import Employee from "../../domain/models/Employee";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import EmployeeDTO from "../dtos/EmployeeDTO";
import EmployeeRepository from "../repositories/EmployeeRepository";
import Service from "./Service";

export default class EmployeeService
  implements Service<EmployeeDTO, EmployeeEntity>
{
  constructor(private employeeRepository: EmployeeRepository) {}

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
        employeeDTO.lastName,
        employeeDTO.tools
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
      const employee: EmployeeEntity = await this.employeeRepository.getById(
        employeeId
      );
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
