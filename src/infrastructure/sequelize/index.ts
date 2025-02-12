import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export class SequelizeInstance {
  private static sequelize: Sequelize;

  private constructor() {}

  public static getInstance = () => {
    if (!SequelizeInstance.sequelize) {
      SequelizeInstance.sequelize = new Sequelize({
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "postgres",
      });
    }
    return SequelizeInstance.sequelize;
  };
}

const sequelizeInstance = SequelizeInstance.getInstance();

export default sequelizeInstance;
