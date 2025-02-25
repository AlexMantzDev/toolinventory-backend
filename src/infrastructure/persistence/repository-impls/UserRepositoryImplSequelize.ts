import User from "../../../domain/models/User";
import UserRepository from "../../../domain/respository/UserRepository";
import CustomError from "../../../error/CustomError";
import { createEmail, Email } from "../../../lib/utils/createEmail";
import { throwErrs } from "../../../lib/utils/throwErrs";
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
      throwErrs(err);
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
        createEmail(foundUser.email),
        foundUser.password,
        foundUser.role,
        foundUser.isAllowed,
        foundUser.verifiedAt,
        foundUser.tokenVersion,
        foundUser.createdAt,
        foundUser.updatedAt
      );
      return user;
    } catch (err) {
      throwErrs(err);
    }
  };

  public getByEmail = async (email: Email): Promise<UserEntity | null> => {
    try {
      const foundUser: UserModel | null = await UserModel.findOne({
        where: { email },
      });
      if (!foundUser) return null;
      return new UserEntity(
        foundUser.id,
        createEmail(foundUser.email),
        foundUser.password,
        foundUser.role,
        foundUser.isAllowed,
        foundUser.verifiedAt,
        foundUser.tokenVersion,
        foundUser.createdAt,
        foundUser.updatedAt
      );
    } catch (err) {
      throwErrs(err);
    }
  };

  public getAll = async (): Promise<UserEntity[]> => {
    try {
      const foundUsers: UserModel[] = await UserModel.findAll();
      const users: UserEntity[] = [];
      foundUsers.forEach((foundUser) => {
        const user = new UserEntity(
          foundUser.id,
          createEmail(foundUser.email),
          foundUser.password,
          foundUser.role,
          foundUser.isAllowed,
          foundUser.verifiedAt,
          foundUser.tokenVersion,
          foundUser.createdAt,
          foundUser.updatedAt
        );
        users.push(user);
      });
      return users;
    } catch (err) {
      throwErrs(err);
    }
  };

  public update = async (email: Email, user: User): Promise<void> => {
    try {
      const password = user.getPassword();
      const salt = 10;
      const foundUser = await UserModel.findOne({ where: { email } });
      if (!foundUser) {
        throw new CustomError("Invalid email.", 400);
      }
      const hashedPass = await bcrypt.hash(password, salt);
      const secureUser = new User(
        user.getEmail(),
        hashedPass,
        foundUser.role,
        foundUser.isAllowed,
        foundUser.verifiedAt,
        foundUser.tokenVersion
      );
      const [rowCount] = await UserModel.update(secureUser, {
        where: { email },
      });
      if (rowCount === 0) {
        throw new CustomError("Update operation did not complete", 500);
      }
    } catch (err) {
      throwErrs(err);
    }
  };

  public delete = async (id: number): Promise<void> => {
    try {
      const rowCount = await UserModel.destroy({ where: { id } });
      if (rowCount === 0) {
        throw new CustomError("Delete operation did not complete", 500);
      }
    } catch (err) {
      throwErrs(err);
    }
  };

  public verify = async (id: number): Promise<void> => {
    try {
      const user: UserModel | null = await UserModel.findByPk(id);
      if (!user) {
        throw new CustomError("Invalid token.", 400);
      }
      const verifiedUser = new User(
        createEmail(user.email),
        user.password,
        user.role,
        user.isAllowed,
        new Date(Date.now()),
        user.tokenVersion
      );
      const [rowCount] = await UserModel.update(verifiedUser, {
        where: { id },
      });
      if (rowCount === 0) {
        throw new CustomError("Update operation did not complete.", 500);
      }
    } catch (err) {
      throwErrs(err);
    }
  };

  public deny = async (id: number): Promise<void> => {
    try {
      const foundUser: UserModel | null = await UserModel.findOne({
        where: { id },
      });
      if (!foundUser) {
        throw new CustomError("Invalid email.", 400);
      }
      if (foundUser.isAllowed === false) {
        throw new CustomError("User already set to not allowed.", 400);
      }
      const user = new User(
        foundUser.email,
        foundUser.password,
        foundUser.role,
        false,
        foundUser.verifiedAt,
        ++foundUser.tokenVersion
      );
      await UserModel.update(user, { where: { id } });
    } catch (err) {
      throwErrs(err);
    }
  };

  public permit = async (id: number): Promise<void> => {
    try {
      const foundUser: UserModel | null = await UserModel.findOne({
        where: { id },
      });
      if (!foundUser) {
        throw new CustomError("Invalid email.", 400);
      }
      if (foundUser.isAllowed === true) {
        throw new CustomError("User already set to allowed.", 400);
      }
      const user = new User(
        foundUser.email,
        foundUser.password,
        foundUser.role,
        true,
        foundUser.verifiedAt,
        foundUser.tokenVersion
      );
      await UserModel.update(user, { where: { id } });
    } catch (err) {
      throwErrs(err);
    }
  };

  public getTokenVersion = async (email: Email): Promise<number> => {
    try {
      const foundUser: UserModel | null = await UserModel.findOne({
        where: { email },
      });
      if (!foundUser) {
        throw new CustomError("Invalid email.", 400);
      }
      const userEntity = new UserEntity(
        foundUser.id,
        foundUser.email,
        foundUser.password,
        foundUser.role,
        foundUser.isAllowed,
        foundUser.verifiedAt,
        foundUser.tokenVersion,
        foundUser.createdAt,
        foundUser.updatedAt
      );
      return userEntity.getTokenVersion();
    } catch (err) {
      throwErrs(err);
    }
  };

  public getIsVerified = async (email: Email): Promise<boolean> => {
    try {
      const foundUser: UserModel | null = await UserModel.findOne({
        where: { email },
      });
      if (!foundUser) {
        throw new CustomError("Invalid email.", 400);
      }
      const userEntity = new UserEntity(
        foundUser.id,
        foundUser.email,
        foundUser.password,
        foundUser.role,
        foundUser.isAllowed,
        foundUser.verifiedAt,
        foundUser.tokenVersion,
        foundUser.createdAt,
        foundUser.updatedAt
      );
      return !!userEntity.getVerifiedAt;
    } catch (err) {
      throwErrs(err);
    }
  };
}
