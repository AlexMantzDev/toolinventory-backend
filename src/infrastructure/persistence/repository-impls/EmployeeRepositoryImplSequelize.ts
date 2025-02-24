import Employee from "../../../domain/models/Employee";
import EmployeeRepository from "../../../domain/respository/EmployeeRepository";
import CustomError from "../../../error/CustomError";
import { throwErrs } from "../../../lib/utils/throwErrs";
import { EmployeeModel } from "../../sequelize/models";
import EmployeeEntity from "../entities/EmployeeEntity";

export default class EmployeeRepositoryImplSequelize
  implements EmployeeRepository
{
  constructor() {}

  public save = async (employee: Employee): Promise<void> => {
    try {
      await EmployeeModel.create({
        code: employee.getCode(),
        firstName: employee.getFirstName(),
        lastName: employee.getLastName(),
      });
    } catch (err) {
      throwErrs(err);
    }
  };

  public getById = async (id: number): Promise<EmployeeEntity | null> => {
    try {
      const foundEmployee: EmployeeModel | null = await EmployeeModel.findByPk(
        id
      );
      if (!foundEmployee) {
        return null;
      }
      const employee: EmployeeEntity = new EmployeeEntity(
        foundEmployee.id,
        foundEmployee.code,
        foundEmployee.firstName,
        foundEmployee.lastName,
        foundEmployee.createdAt,
        foundEmployee.updatedAt
      );
      return employee;
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAll = async (): Promise<EmployeeEntity[]> => {
    try {
      const foundEmployees: EmployeeModel[] = await EmployeeModel.findAll();
      const employees: EmployeeEntity[] = [];
      if (!foundEmployees) return employees;
      foundEmployees.forEach((foundEmployee: EmployeeModel) => {
        const employee = new EmployeeEntity(
          foundEmployee.id,
          foundEmployee.code,
          foundEmployee.firstName,
          foundEmployee.lastName,
          foundEmployee.createdAt,
          foundEmployee.updatedAt
        );
        employees.push(employee);
      });
      return employees;
    } catch (err) {
      throwErrs(err);
    }
  };

  public update = async (id: number, employee: Employee): Promise<void> => {
    try {
      const [updatedRows] = await EmployeeModel.update(employee, {
        where: { id },
      });
      if (updatedRows === 0) {
        throw new CustomError("Update operation did not complete.", 500);
      }
      return;
    } catch (err) {
      throwErrs(err);
    }
  };

  public delete = async (id: number): Promise<void> => {
    try {
      const rowCount = await EmployeeModel.destroy({ where: { id } });
      if (rowCount === 0) {
        throw new CustomError("Delete operation did not complete.", 500);
      }
    } catch (err) {
      throwErrs(err);
    }
  };
}
