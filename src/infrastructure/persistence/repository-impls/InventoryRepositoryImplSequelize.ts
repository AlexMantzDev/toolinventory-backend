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
    foundTools.forEach((e: ToolModel) => {
      const tool = new ToolEntity(
        e?.id,
        e?.code,
        e?.name,
        e?.status,
        e?.createdAt,
        e?.updatedAt
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
    const records: ToolModel[] = await ToolModel.findAll({
      include: [
        {
          model: EmployeeModel,
          as: "employees",
          through: { attributes: [] },
          required: true,
        },
      ],
    });
    if (!records || records.length === 0) {
      return [];
    }
    const tools: ToolEntity[] = [];
    records.forEach((e) => {
      const tool = new ToolEntity(
        e?.id,
        e?.code,
        e?.name,
        e?.status,
        e?.createdAt,
        e?.updatedAt
      );
      tools.push(tool);
    });
    return tools;
  };

  public getAllEmployeesWithTools = async (): Promise<EmployeeEntity[]> => {
    const records: EmployeeModel[] = await EmployeeModel.findAll({
      include: [
        {
          model: ToolModel,
          as: "tools",
          through: { attributes: [] },
          required: true,
        },
      ],
    });
    if (!records || records.length === 0) {
      return [];
    }
    const employees: EmployeeEntity[] = [];
    records.forEach((e) => {
      const employee = new EmployeeEntity(
        e?.id,
        e?.code,
        e?.firstName,
        e?.lastName,
        e?.createdAt,
        e?.updatedAt
      );
      employees.push(employee);
    });
    return employees;
  };
}
