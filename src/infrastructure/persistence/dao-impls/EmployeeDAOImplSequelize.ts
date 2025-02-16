import DAO from "../../../domain/daos/DAO";
import Employee from "../../../domain/models/Employee";
import EmployeeEntity from "../entities/EmployeeEntity";

export default class EmployeeDAOImplSequelize
  implements DAO<Employee, EmployeeEntity>
{
  constructor() {}

  async save(employee: Employee): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getById(id: string): Promise<EmployeeEntity | null> {
    throw new Error("Method not implemented.");
  }
  async getAll(): Promise<EmployeeEntity[]> {
    throw new Error("Method not implemented.");
  }
  async update(id: string, employee: Employee): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
