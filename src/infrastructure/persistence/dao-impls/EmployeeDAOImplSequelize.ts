import DAO from "../../../domain/daos/DAO";
import Employee from "../../../domain/models/Employee";
import CustomError from "../../../error/CustomError";
import InternalServerError from "../../../error/InternalServerError";
import { EmployeeModel, ToolModel } from "../../sequelize/models";
import EmployeeEntity from "../entities/EmployeeEntity";

export default class EmployeeDAOImplSequelize
  implements DAO<Employee, EmployeeEntity>
{
  constructor() {}

  public save = async (employee: Employee): Promise<void> => {
    try {
      const employeeModel: EmployeeModel = await EmployeeModel.create({
        id: employee.getId(),
        firstName: employee.getFirstName(),
        lastName: employee.getLastName(),
      });
      if (employee.getTools().length > 0) {
        const toolIds = employee.getTools().map((tools) => tools.getId());
        const tools = await ToolModel.findAll({ where: { id: toolIds } });
        await (employeeModel as any).addTools(tools);
      }
      return;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getById = async (id: string): Promise<EmployeeEntity | null> => {
    try {
      const foundEmployee: EmployeeModel | null = await EmployeeModel.findByPk(
        id,
        {
          include: { model: ToolModel, through: { attributes: [] } },
        }
      );
      if (!foundEmployee) {
        return null;
      }
      const employee: EmployeeEntity = new EmployeeEntity(
        foundEmployee?.id,
        foundEmployee?.firstName,
        foundEmployee?.lastName,
        foundEmployee?.tools,
        foundEmployee?.createdAt,
        foundEmployee?.updatedAt
      );
      return employee;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

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
