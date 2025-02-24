import InventoryRepository from "../../../domain/respository/InventoryRepository";
import { throwErrs } from "../../../lib/utils/throwErrs";
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
    try {
      await EmployeesToolsModel.create({ employeeId, toolId });
    } catch (err) {
      throwErrs(err);
    }
  };

  public removeToolFromEmployee = async (
    employeeId: number,
    toolId: number
  ): Promise<void> => {
    try {
      await EmployeesToolsModel.destroy({ where: { employeeId, toolId } });
    } catch (err) {
      throwErrs(err);
    }
  };

  public getToolsByEmployee = async (
    employeeId: number
  ): Promise<ToolEntity[]> => {
    try {
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
    } catch (err) {
      throwErrs(err);
    }
  };

  public getEmployeeByTool = async (
    toolId: number
  ): Promise<EmployeeEntity | null> => {
    try {
      const foundEmployee = await EmployeeModel.findOne({
        include: [
          {
            model: ToolModel,
            as: "tools",
            where: { id: toolId },
            through: { attributes: [] },
          },
        ],
      });
      if (!foundEmployee) {
        return null;
      }
      return new EmployeeEntity(
        foundEmployee.id,
        foundEmployee.code,
        foundEmployee.firstName,
        foundEmployee.lastName,
        foundEmployee.createdAt,
        foundEmployee.updatedAt
      );
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAllToolsIssued = async (): Promise<ToolEntity[]> => {
    try {
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
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAllEmployeesWithTools = async (): Promise<EmployeeEntity[]> => {
    try {
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
}
