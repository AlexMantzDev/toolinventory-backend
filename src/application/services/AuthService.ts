import User from "../../domain/models/User";
import CustomError from "../../error/CustomError";
import UserDTO from "../dtos/UserDTO";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepositoryImplSequelize from "../../infrastructure/persistence/repository-impls/UserRepositoryImplSequelize";
import NotFoundError from "../../error/NotFoundError";
import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import NodeMailerInstance from "../../infrastructure/email/NodeMailer";
import AccessTokenService from "./AccessTokenService";
import RefreshTokenService from "./RefreshTokenService";
import VerifyTokenService from "./VerifyTokenService";
import ResetTokenService from "./ResetTokenService";
import ResetTokenEntity from "../../infrastructure/persistence/entities/ResetTokenEntity";
import { throwErrs } from "../../lib/utils/throwErrs";
import { Email } from "../../lib/utils/createEmail";

const VERIFY_SECRET = process.env.VERIFY_SECRET!;
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}/api/v1/auth`; //TODO: this will be to the frontend
const EMAIL_USER = process.env.EMAIL_USER!;

export default class AuthService {
  constructor(
    private userRepository: UserRepositoryImplSequelize,
    private refreshTokenService: RefreshTokenService,
    private accessTokenService: AccessTokenService,
    private verifyTokenService: VerifyTokenService,
    private resetTokenService: ResetTokenService
  ) {}

  public login = async (
    email: Email,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const userEntity: UserEntity | null =
        await this.userRepository.getByEmail(email);
      if (!userEntity) {
        throw new CustomError("Invalid email or password.", 400);
      }
      const match = await bcrypt.compare(password, userEntity.getPassword());
      if (!match) {
        throw new CustomError("Invalid email or password.", 401);
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
      throwErrs(err);
    }
  };

  public register = async (userDTO: UserDTO): Promise<void> => {
    try {
      const foundUser = await this.userRepository.getByEmail(userDTO.email);
      if (foundUser) {
        throw new CustomError("User with this email exists already.", 409);
      }
      const saltRounds: number = 10;
      const passwordHash: string = await bcrypt.hash(
        userDTO.password,
        saltRounds
      );
      const user = new User(userDTO.email, passwordHash);
      await this.userRepository.save(user);
      const savedUser: UserEntity | null = await this.userRepository.getByEmail(
        userDTO.email
      );
      if (!savedUser) {
        throw new CustomError("Problem saving new user user.", 500);
      }
      const verifyTokenString: string =
        await this.verifyTokenService.issueNewVerifyToken(savedUser.getId());
      const verifyLink: string = `${BASE_URL}/verify?token=${verifyTokenString}`; //TODO: this will be to the frontend verify page which will call the api route
      const mailer = await NodeMailerInstance.getInstance();
      mailer.sendVerify(EMAIL_USER, verifyLink);
      return;
    } catch (err) {
      throwErrs(err);
    }
  };

  public resendVerifyLink = async (email: Email): Promise<void> => {
    try {
      const savedUser: UserEntity | null = await this.userRepository.getByEmail(
        email
      );
      if (!savedUser) {
        throw new NotFoundError("Could not find user with email: " + email);
      }
      const verifyTokenString: string =
        await this.verifyTokenService.issueNewVerifyToken(savedUser.getId());
      const verifyLink: string = `${BASE_URL}/verify?token=${verifyTokenString}`; //TODO: this will be to the frontend verify page which will call the api route
      const mailer = await NodeMailerInstance.getInstance();
      mailer.sendVerify(EMAIL_USER, verifyLink);
      return;
    } catch (err) {
      throwErrs(err);
    }
  };

  public logout = async (userId: number): Promise<void> => {
    try {
      this.refreshTokenService.deleteRefreshTokenEntry(userId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public update = async (email: Email, userDTO: UserDTO): Promise<void> => {
    try {
      const newUser: User = new User(userDTO.email, userDTO.password);
      await this.userRepository.update(email, newUser);
    } catch (err) {
      throwErrs(err);
    }
  };

  public sendResetLink = async (email: Email): Promise<void> => {
    try {
      const savedUser: UserEntity | null = await this.userRepository.getByEmail(
        email
      );
      if (!savedUser) {
        throw new NotFoundError("Could not find user with email: " + email);
      }
      const resetTokenString: string =
        await this.resetTokenService.issueNewResetToken(email);
      const resetLink: string = `${BASE_URL}/change-pass?token=${resetTokenString}`; //TODO: this will be to the frontend password reset page which will call the api route
      const mailer = await NodeMailerInstance.getInstance();
      mailer.sendReset(EMAIL_USER, resetLink);
      return;
    } catch (err) {
      throwErrs(err);
    }
  };

  public resetPassword = async (
    token: string,
    password: string
  ): Promise<void> => {
    try {
      const decoded: JwtPayload = jwt.decode(token) as JwtPayload;
      const userId: number = Number(decoded?.sub);
      if (!userId) {
        throw new CustomError("Invalid token.", 401);
      }
      const foundUser: UserEntity | null = await this.userRepository.getById(
        userId
      );
      if (!foundUser) {
        throw new CustomError("Invalid token.", 401);
      }
      const foundResetToken: ResetTokenEntity | null =
        await this.resetTokenService.findEntryByUserId(userId);
      if (!foundResetToken) {
        throw new CustomError("Invalid token.", 401);
      }
      const newUser: User = new User(foundUser.getEmail(), password);
      await this.userRepository.update(foundUser.getEmail(), newUser);
      await this.resetTokenService.deleteResetTokenEntry(userId);
    } catch (err) {
      throwErrs(err);
    }
  };

  public verify = async (token: string): Promise<void> => {
    try {
      const decoded: JwtPayload = jwt.verify(
        token,
        VERIFY_SECRET
      ) as JwtPayload;
      const userId: number = Number(decoded.sub);
      const user: UserEntity | null = await this.userRepository.getById(userId);
      if (!user) {
        throw new CustomError("Invalid token.", 400);
      }
      if (user.getVerifiedAt() !== null) {
        throw new CustomError("User has already been verified.", 410);
      }
      await this.userRepository.verify(user.getId());
      await this.verifyTokenService.deleteVerifyTokenEntry(userId);
    } catch (err) {
      throwErrs(err);
    }
  };
}
