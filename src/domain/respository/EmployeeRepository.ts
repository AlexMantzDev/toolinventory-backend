import EmployeeEntity from "../../infrastructure/persistence/entities/EmployeeEntity";
import Employee from "../models/Employee";

export default interface EmployeeRepository {
  save(employee: Employee): Promise<void>;
  getById(id: number): Promise<EmployeeEntity | null>;
  getAll(): Promise<EmployeeEntity[]>;
  update(id: number, employee: Employee): Promise<void>;
  delete(id: number): Promise<void>;
}
