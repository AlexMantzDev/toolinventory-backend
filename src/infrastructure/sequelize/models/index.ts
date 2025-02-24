import EmployeeModel from "./EmployeeModel";
import ToolModel from "./ToolModel";
import EmployeesToolsModel from "./EmployeesToolsModel";
import EmployeeToolsModel from "./EmployeesToolsModel";

EmployeeModel.belongsToMany(ToolModel, {
  through: EmployeeToolsModel,
  foreignKey: "employeeId",
  otherKey: "toolId",
  as: "tools",
});

ToolModel.belongsToMany(EmployeeModel, {
  through: EmployeeToolsModel,
  foreignKey: "toolId",
  otherKey: "employeeId",
  as: "employees",
});

ToolModel.hasMany(ToolModel, { foreignKey: "parentId", as: "childTools" });
ToolModel.belongsTo(ToolModel, { foreignKey: "parentId", as: "parentTool" });

export { EmployeeModel, ToolModel, EmployeesToolsModel };
