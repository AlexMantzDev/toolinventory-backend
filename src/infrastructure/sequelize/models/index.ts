import EmployeeModel from "./EmployeeModel";
import ToolModel from "./ToolModel";
import EmployeesToolsModel from "./EmployeesToolsModel";

EmployeeModel.belongsToMany(ToolModel, {
  through: EmployeesToolsModel,
  foreignKey: "employeeId",
  as: "tools",
});

ToolModel.belongsToMany(EmployeeModel, {
  through: EmployeesToolsModel,
  foreignKey: "toolId",
  as: "employees",
});

export { EmployeeModel, ToolModel, EmployeesToolsModel };
