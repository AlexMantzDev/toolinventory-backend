import DAO from "../../domain/daos/DAO";
import Employee from "../../domain/models/Employee";
import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import Repository from "./Repository";

export default class EmployeeRepository
  implements Repository<Employee, EmployeeEntity>
{
  constructor(private employeeDAO: DAO<Employee, EmployeeEntity>) {}

  save(t: Employee): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<EmployeeEntity> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<EmployeeEntity[]> {
    throw new Error("Method not implemented.");
  }
  update(id: string, t: Employee): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
