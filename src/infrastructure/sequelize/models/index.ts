import EmployeeModel from "./EmployeeModel";
import ToolModel from "./ToolModel";
import EmployeesToolsModel from "./EmployeesToolsModel";
import RefreshTokenModel from "./RefreshTokenModel";
import UserModel from "./UserModel";
import VerifyTokenModel from "./VerifyTokenModel";
import ResetTokenModel from "./ResetTokenModel";

EmployeeModel.belongsToMany(ToolModel, {
  through: EmployeesToolsModel,
  foreignKey: "employeeId",
  otherKey: "toolId",
  as: "tools",
  onDelete: "CASCADE",
});

ToolModel.belongsToMany(EmployeeModel, {
  through: EmployeesToolsModel,
  foreignKey: "toolId",
  otherKey: "employeeId",
  as: "employees",
  onDelete: "CASCADE",
});

ToolModel.hasMany(ToolModel, { foreignKey: "parentId", as: "childTools" });
ToolModel.belongsTo(ToolModel, { foreignKey: "id", as: "parentTool" });

UserModel.hasOne(RefreshTokenModel, { foreignKey: "userId" });
RefreshTokenModel.belongsTo(UserModel, { foreignKey: "id" });

UserModel.hasOne(VerifyTokenModel, { foreignKey: "userId" });
VerifyTokenModel.belongsTo(UserModel, { foreignKey: "id" });

UserModel.hasOne(ResetTokenModel, { foreignKey: "userId" });
ResetTokenModel.belongsTo(UserModel, { foreignKey: "id" });

export { EmployeeModel, ToolModel, EmployeesToolsModel };
