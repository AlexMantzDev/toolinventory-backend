import Employee from "../../domain/models/Employee";
import EmployeeRepository from "../../domain/respository/EmployeeRepository";
import NotFoundError from "../../error/NotFoundError";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import { throwErrs } from "../../lib/utils/throwErrs";
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
      throwErrs(err);
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
      throwErrs(err);
    }
  };

  public delete = async (employeeId: number): Promise<void> => {
    try {
      await this.employeeRepository.delete(employeeId);
    } catch (err) {
      throwErrs(err);
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
      throwErrs(err);
    }
  };

  public findAll = async (): Promise<EmployeeEntity[]> => {
    try {
      return await this.employeeRepository.getAll();
    } catch (err) {
      throwErrs(err);
    }
  };
}
