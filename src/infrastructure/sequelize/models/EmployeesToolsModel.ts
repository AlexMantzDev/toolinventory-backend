import { DataTypes, Model } from "sequelize";
import sequelize from "..";

class EmployeeToolsModel extends Model {
  public employeeId!: string;
  public toolId!: string;
}

EmployeeToolsModel.init(
  {
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    toolId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "tools",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "EmployeesTools",
    tableName: "employees_tools",
    timestamps: false,
  }
);

export default EmployeeToolsModel;
