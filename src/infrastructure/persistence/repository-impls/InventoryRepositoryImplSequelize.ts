import InventoryRepository from "../../../domain/respository/InventoryRepository";
import {
  EmployeeModel,
  EmployeesToolsModel,
  ToolModel,
} from "../../sequelize/models";
import EmployeeEntity from "../entities/EmployeeEntity";
import ToolEntity from "../entities/ToolEntity";

export default class InventoryRepositoryImplSequelize
  implements InventoryRepository
{
  public assignToolToEmployee = async (
    employeeId: number,
    toolId: number
  ): Promise<void> => {
    await EmployeesToolsModel.create({ employeeId, toolId });
  };

  public removeToolFromEmployee = async (
    employeeId: number,
    toolId: number
  ): Promise<void> => {
    await EmployeesToolsModel.destroy({ where: { employeeId, toolId } });
  };

  public getToolsByEmployee = async (
    employeeId: number
  ): Promise<ToolEntity[]> => {
    const foundTools: ToolModel[] = await ToolModel.findAll({
      include: [
        {
          model: EmployeeModel,
          as: "employees",
          where: { id: employeeId },
          through: { attributes: [] },
        },
      ],
    });
    const tools: ToolEntity[] = [];
    foundTools.forEach((foundTool: ToolModel) => {
      const tool = new ToolEntity(
        foundTool.id,
        foundTool.code,
        foundTool.name,
        foundTool.status,
        foundTool.type,
        foundTool.parentId,
        foundTool.location,
        foundTool.createdAt,
        foundTool.updatedAt
      );
      tools.push(tool);
    });
    return tools;
  };

  public getEmployeeByTool = async (
    toolId: number
  ): Promise<EmployeeEntity | null> => {
    const record = await EmployeeModel.findOne({
      include: [
        {
          model: ToolModel,
          as: "tools",
          where: { id: toolId },
          through: { attributes: [] },
        },
      ],
    });
    if (!record) {
      return null;
    }
    return new EmployeeEntity(
      record?.id,
      record?.code,
      record?.firstName,
      record?.lastName,
      record?.createdAt,
      record?.updatedAt
    );
  };

  public getAllToolsIssued = async (): Promise<ToolEntity[]> => {
    const foundTools: ToolModel[] = await ToolModel.findAll({
      include: [
        {
          model: EmployeeModel,
          as: "employees",
          through: { attributes: [] },
          required: true,
        },
      ],
    });
    if (!foundTools || foundTools.length === 0) {
      return [];
    }
    const tools: ToolEntity[] = [];
    foundTools.forEach((foundTool) => {
      const tool = new ToolEntity(
        foundTool.id,
        foundTool.code,
        foundTool.name,
        foundTool.status,
        foundTool.type,
        foundTool.parentId,
        foundTool.location,
        foundTool.createdAt,
        foundTool.updatedAt
      );
      tools.push(tool);
    });
    return tools;
  };

  public getAllEmployeesWithTools = async (): Promise<EmployeeEntity[]> => {
    const foundEmployees: EmployeeModel[] = await EmployeeModel.findAll({
      include: [
        {
          model: ToolModel,
          as: "tools",
          through: { attributes: [] },
          required: true,
        },
      ],
    });
    if (!foundEmployees || foundEmployees.length === 0) {
      return [];
    }
    const employees: EmployeeEntity[] = [];
    foundEmployees.forEach((foundEmployee) => {
      const employee = new EmployeeEntity(
        foundEmployee?.id,
        foundEmployee?.code,
        foundEmployee?.firstName,
        foundEmployee?.lastName,
        foundEmployee?.createdAt,
        foundEmployee?.updatedAt
      );
      employees.push(employee);
    });
    return employees;
  };
}
