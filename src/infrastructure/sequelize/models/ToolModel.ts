import { Model } from "sequelize";
import { DataTypes } from "sequelize";
import { ToolStatus, ToolType } from "../../../domain/models/Tool";
import sequelize from "..";

class ToolModel extends Model {
  public id!: number;
  public code!: string;
  public name!: string;
  public status!: ToolStatus;
  public type!: ToolType;
  public parentId!: number;
  public location!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ToolModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
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
      defaultValue: "serviceable",
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("single", "child", "parent"),
      defaultValue: "single",
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      references: {
        model: ToolModel,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
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
