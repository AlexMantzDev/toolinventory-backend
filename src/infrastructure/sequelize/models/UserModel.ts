import { DataTypes, Model } from "sequelize";
import sequelize from "..";
import { UserRoles } from "../../../domain/models/User";
import { Email } from "../../../lib/utils/createEmail";

class UserModel extends Model {
  public id!: number;
  public email!: Email;
  public password!: string;
  public role!: UserRoles;
  public isAllowed!: boolean;
  public verifiedAt!: Date | null;
  public tokenVersion!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Must be a valid email address.",
        },
      },
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "associate"),
      defaultValue: "associate",
    },
    isAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default UserModel;
