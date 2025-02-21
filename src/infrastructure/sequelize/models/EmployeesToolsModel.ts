import { DataTypes, Model } from "sequelize";
import sequelize from "..";

class EmployeeToolsModel extends Model {
  public employeeId!: number;
  public toolId!: number;
}

EmployeeToolsModel.init(
  {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    toolId: {
      type: DataTypes.INTEGER,
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
