import User from "../../../domain/models/User";
import UserRepository from "../../../domain/respository/UserRepository";
import CustomError from "../../../error/CustomError";
import InternalServerError from "../../../error/InternalServerError";
import NotFoundError from "../../../error/NotFoundError";
import UserModel from "../../sequelize/models/UserModel";
import UserEntity from "../entities/UserEntity";
import bcrypt from "bcrypt";

export default class UserRepositoryImplSequelize implements UserRepository {
  constructor() {}

  public save = async (user: User): Promise<void> => {
    try {
      await UserModel.create({
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole(),
      });
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getById = async (id: number): Promise<UserEntity | null> => {
    try {
      const foundUser: UserModel | null = await UserModel.findByPk(id);
      if (!foundUser) {
        return null;
      }
      const user = new UserEntity(
        foundUser.id,
        foundUser.email,
        foundUser.password,
        foundUser.role,
        foundUser.verifiedAt,
        foundUser.createdAt,
        foundUser.updatedAt
      );
      return user;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getByEmail = async (email: string): Promise<UserEntity | null> => {
    try {
      const foundUser: UserModel | null = await UserModel.findOne({
        where: { email },
      });
      if (!foundUser) return null;
      return new UserEntity(
        foundUser.id,
        foundUser.email,
        foundUser.password,
        foundUser.role,
        foundUser.verifiedAt,
        foundUser.createdAt,
        foundUser.updatedAt
      );
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public getAll = async (): Promise<UserEntity[]> => {
    try {
      const foundUsers: UserModel[] = await UserModel.findAll();
      const users: UserEntity[] = [];
      foundUsers.forEach((foundUser) => {
        const user = new UserEntity(
          foundUser.id,
          foundUser.email,
          foundUser.password,
          foundUser.role,
          foundUser.verifiedAt,
          foundUser.createdAt,
          foundUser.updatedAt
        );
        users.push(user);
      });
      return users;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (id: number, user: User): Promise<void> => {
    try {
      const password = user.getPassword();
      const salt = 10;
      const hashedPass = await bcrypt.hash(password, salt);
      const secureUser = new User(user.getEmail(), hashedPass);
      const [rowCount] = await UserModel.update(secureUser, { where: { id } });
      if (rowCount === 0) {
        throw new CustomError("Update operation did not complete", 500);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public delete = async (id: number): Promise<void> => {
    try {
      const rowCount = await UserModel.destroy({ where: { id } });
      if (rowCount === 0) {
        throw new CustomError("Delete operation did not complete", 500);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public verify = async (id: number): Promise<void> => {
    try {
      const user: UserModel | null = await UserModel.findByPk(id);
      if (!user) {
        throw new NotFoundError("Could not find user with id: " + id);
      }
      const verifiedUser = new User(user.email, user.password);
      verifiedUser.setVerifiedAt();
      const [rowCount] = await UserModel.update(verifiedUser, {
        where: { id },
      });
      if (rowCount === 0) {
        throw new CustomError("Update operation did not complete.", 500);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
