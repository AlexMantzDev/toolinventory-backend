import { Model } from "sequelize";
import { DataTypes } from "sequelize";
import { ToolStatus } from "../../../domain/models/Tool";
import sequelize from "..";

class ToolModel extends Model {
  public id!: string;
  public name!: string;
  public status!: ToolStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ToolModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "serviceable",
        "issued",
        "broken",
        "hold",
        "calibration due",
        "inspection due"
      ),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Tool",
    tableName: "tools",
    timestamps: true,
  }
);

export default ToolModel;
