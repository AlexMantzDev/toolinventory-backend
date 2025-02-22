import Employee from "../../domain/models/Employee";
import EmployeeRepository from "../../domain/respository/EmployeeRepository";
import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";
import NotFoundError from "../../error/NotFoundError";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import EmployeeDTO from "../dtos/EmployeeDTO";

export default class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  public create = async (employeeDTO: EmployeeDTO): Promise<void> => {
    try {
      const employee = new Employee(
        employeeDTO.code,
        employeeDTO.firstName,
        employeeDTO.lastName
      );
      await this.employeeRepository.save(employee);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (
    employeeId: number,
    employeeDTO: EmployeeDTO
  ): Promise<void> => {
    try {
      const employee = new Employee(
        employeeDTO.code,
        employeeDTO.firstName,
        employeeDTO.lastName
      );
      await this.employeeRepository.update(employeeId, employee);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (employeeId: number): Promise<void> => {
    try {
      await this.employeeRepository.delete(employeeId);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public findById = async (employeeId: number): Promise<EmployeeEntity> => {
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
      return await this.employeeRepository.getAll();
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
