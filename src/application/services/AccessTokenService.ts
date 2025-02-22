import UserRepository from "../../domain/respository/UserRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../../error/CustomError";
import NotFoundError from "../../error/NotFoundError";
import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import InternalServerError from "../../error/InternalServerError";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export default class AccessTokenService {
  constructor(private userRepository: UserRepository) {}

  public createAccessTokenStringFromUserEmail = async (
    email: string
  ): Promise<string> => {
    try {
      const userEntity: UserEntity | null =
        await this.userRepository.getByEmail(email);
      if (!userEntity) {
        throw new NotFoundError("Could not find user with email: " + email);
      }
      const accessToken: string = jwt.sign(
        {
          sub: userEntity.getId(),
          role: userEntity.getRole(),
          iat: Date.now() / 1000,
          scope: "access_token",
          email: userEntity.getEmail(),
        },
        ACCESS_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return accessToken;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };

  public createAccessTokenStringFromRefreshTokenString = async (
    refreshTokenString: string
  ): Promise<string> => {
    try {
      const refreshToken: JwtPayload = jwt.verify(
        refreshTokenString,
        REFRESH_SECRET
      ) as JwtPayload;
      if (typeof refreshToken === "string") {
        throw new CustomError("Invalid token.", 400);
      }
      if (refreshToken.sub === undefined) {
        throw new CustomError("Invalild token.", 400);
      }
      const userEntity: UserEntity | null = await this.userRepository.getById(
        Number(refreshToken.sub)
      );
      if (!userEntity) {
        throw new NotFoundError(
          "Could not find user with id: " + refreshToken.sub
        );
      }
      const newAccessToken = jwt.sign(
        {
          sub: refreshToken.sub,
          role: userEntity.getRole(),
          iat: Date.now(),
          scope: "access_token",
          email: userEntity.getEmail(),
        },
        ACCESS_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return newAccessToken;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new InternalServerError("Internal server error.");
    }
  };
}
