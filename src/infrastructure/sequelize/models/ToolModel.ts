import { Model } from "sequelize";
import { DataTypes } from "sequelize";
import { ToolStatus } from "../../../domain/models/Tool";
import sequelize from "..";

class ToolModel extends Model {
  public id!: string;
  public name!: string;
  public status!: ToolStatus;
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
  },
  {
    sequelize,
    modelName: "Tool",
    tableName: "tools",
  }
);

export default ToolModel;
