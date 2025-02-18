import { DataTypes, Model } from "sequelize";
import sequelize from "..";

class EmployeeModel extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EmployeeModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Employee",
    tableName: "empoyees",
    timestamps: true,
  }
);

export default EmployeeModel;
