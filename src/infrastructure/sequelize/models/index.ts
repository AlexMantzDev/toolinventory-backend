import EmployeeModel from "./EmployeeModel";
import ToolModel from "./ToolModel";
import EmployeesToolsModel from "./EmployeesToolsModel";
import EmployeeToolsModel from "./EmployeesToolsModel";
import RefreshTokenModel from "./RefreshTokenModel";
import UserModel from "./UserModel";
import VerifyTokenModel from "./VerifyTokenModel";
import ResetTokenModel from "./ResetTokenModel";

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
ToolModel.belongsTo(ToolModel, { foreignKey: "id", as: "parentTool" });

UserModel.hasOne(RefreshTokenModel, { foreignKey: "userId" });
RefreshTokenModel.belongsTo(UserModel, { foreignKey: "id" });

UserModel.hasOne(VerifyTokenModel, { foreignKey: "userId" });
VerifyTokenModel.belongsTo(UserModel, { foreignKey: "id" });

UserModel.hasOne(ResetTokenModel, { foreignKey: "userId" });
ResetTokenModel.belongsTo(UserModel, { foreignKey: "id" });

export { EmployeeModel, ToolModel, EmployeesToolsModel };
