import User from "../../domain/models/User";
import CustomError from "../../error/CustomError";
import UserDTO from "../dtos/UserDTO";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepositoryImplSequelize from "../../infrastructure/persistence/repository-impls/UserRepositoryImplSequelize";
import InternalServerError from "../../error/InternalServerError";
import NotFoundError from "../../error/NotFoundError";
import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import NodeMailerInstance from "../../infrastructure/email/NodeMailer";
import AccessTokenService from "./AccessTokenService";
import RefreshTokenService from "./RefreshTokenService";

const VERIFY_SECRET = process.env.VERIFY_SECRET!;
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const EMAIL_USER = process.env.EMAIL_USER!;

export default class AuthService {
  constructor(
    private userRepository: UserRepositoryImplSequelize,
    private refreshTokenService: RefreshTokenService,
    private accessTokenService: AccessTokenService
  ) {}

  public login = async (
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const userEntity: UserEntity | null =
        await this.userRepository.getByEmail(email);
      if (!userEntity) {
        throw new CustomError("Invalid email or password.", 403);
      }
      const match = await bcrypt.compare(password, userEntity.getPassword());
      if (!match) {
        throw new CustomError("Invalid email or password.", 403);
      }
      const accessTokenString: string =
        await this.accessTokenService.createAccessTokenStringFromUserEmail(
          userEntity.getEmail()
        );
      const refreshTokenString: string =
        await this.refreshTokenService.issueNewRefreshToken(userEntity.getId());
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
      const verifyTokenString: string = jwt.sign({ email }, VERIFY_SECRET, {
        expiresIn: "1h",
      });
      //save verify token string to database
      const verifyLink: string = `${BASE_URL}/api/v1/auth/verify?token=${verifyTokenString}`;
      const saltRounds: number = 10;
      const passwordHash: string = await bcrypt.hash(
        userDTO.password,
        saltRounds
      );
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

  public logout = async (userId: number): Promise<void> => {
    try {
      this.refreshTokenService.deleteRefreshTokenEntry(userId);
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
      const decoded: JwtPayload = jwt.verify(
        token,
        VERIFY_SECRET
      ) as JwtPayload;
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
