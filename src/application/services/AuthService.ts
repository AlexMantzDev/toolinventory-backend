import User from "../../domain/models/User";
import CustomError from "../../error/CustomError";
import UserDTO from "../dtos/UserDTO";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepositoryImplSequelize from "../../infrastructure/persistence/repository-impls/UserRepositoryImplSequelize";
import RefreshTokenRepositoryImplSequelize from "../../infrastructure/persistence/repository-impls/RefreshTokenRepositoryImplSequelize";
import RefreshToken from "../../domain/models/RefreshToken";
import InternalServerError from "../../error/InternalServerError";
import UserModel from "../../infrastructure/sequelize/models/UserModel";
import NotFoundError from "../../error/NotFoundError";
import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import NodeMailerInstance from "../../infrastructure/email/NodeMailer";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const VERIFY_SECRET = process.env.VERIFY_SECRET!;
const NODE_ENV = process.env.NODE_ENV!;
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const EMAIL_USER = process.env.EMAIL_USER!;

export default class AuthService {
  constructor(
    private userRepository: UserRepositoryImplSequelize,
    private refreshTokenRepository: RefreshTokenRepositoryImplSequelize
  ) {}

  public login = async (
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const userEntity = await this.userRepository.getByEmail(email);
      if (!userEntity) {
        throw new CustomError("Invalid email or password.", 403);
      }
      if (NODE_ENV === "prod") {
        const match = await bcrypt.compare(password, userEntity.getPassword());
        if (!match) {
          throw new CustomError("Invalid email or password.", 403);
        }
      }
      const accessTokenString = jwt.sign(
        {
          id: userEntity.getId(),
          email: userEntity.getEmail(),
        },
        ACCESS_SECRET,
        { expiresIn: "1h" }
      );
      const refreshTokenString = jwt.sign(
        {
          id: userEntity.getId(),
          email: userEntity.getEmail(),
        },
        REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      const refreshToken = new RefreshToken(
        userEntity.getId(),
        refreshTokenString,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      );
      await this.refreshTokenRepository.save(refreshToken);
      return {
        accessToken: accessTokenString,
        refreshToken: refreshTokenString,
      };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public register = async (userDTO: UserDTO): Promise<void> => {
    try {
      const foundUser = await this.userRepository.getByEmail(userDTO.email);
      if (foundUser) {
        throw new CustomError("User with this email exists already.", 402);
      }
      const email = userDTO.email;
      const verifyToken: string = jwt.sign({ email }, VERIFY_SECRET, {
        expiresIn: "24h",
      });
      const verifyLink = `${BASE_URL}/api/v1/auth/verify?token=${verifyToken}`;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(userDTO.password, saltRounds);
      const user = new User(userDTO.email, passwordHash);
      const mailer = await NodeMailerInstance.getInstance();
      mailer.send(EMAIL_USER, verifyLink);
      return await this.userRepository.save(user);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public logout = async (token: string): Promise<void> => {
    try {
      this.refreshTokenRepository.delete(token);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public update = async (userId: number, userDTO: UserDTO): Promise<void> => {
    try {
      const newUser: User = new User(userDTO.email, userDTO.password);
      await this.userRepository.update(userId, newUser);
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public verify = async (token: string): Promise<void> => {
    try {
      const decoded = jwt.verify(token.toString(), VERIFY_SECRET) as JwtPayload;
      const user: UserEntity | null = await this.userRepository.getByEmail(
        decoded.email
      );
      if (!user) {
        throw new NotFoundError(
          "Could not find user with email: " + decoded.email
        );
      }
      if (user.getVerifiedAt() !== null) {
        throw new CustomError("User has already been verified.", 400);
      }
      await this.userRepository.verify(user.getId());
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
