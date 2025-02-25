import UserRepository from "../../domain/respository/UserRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../../error/CustomError";
import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import { Email } from "../../lib/utils/createEmail";
import { throwErrs } from "../../lib/utils/throwErrs";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export default class AccessTokenService {
  constructor(private userRepository: UserRepository) {}

  public createAccessToken = async (email: Email): Promise<string> => {
    try {
      const userEntity: UserEntity | null =
        await this.userRepository.getByEmail(email);
      if (!userEntity) {
        throw new CustomError("Invalid email.", 400);
      }
      const accessToken: string = jwt.sign(
        {
          sub: userEntity.getId(),
          role: userEntity.getRole(),
          iat: Date.now() / 1000,
          scope: "access_token",
          email: userEntity.getEmail(),
          version: userEntity.getTokenVersion(),
        },
        ACCESS_SECRET,
        {
          expiresIn: "15min",
        }
      );
      return accessToken;
    } catch (err) {
      throwErrs(err);
    }
  };

  public refreshAccessToken = async (
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
        throw new CustomError("Invalid token.", 400);
      }
      const newAccessToken = jwt.sign(
        {
          sub: refreshToken.sub,
          role: userEntity.getRole(),
          iat: Date.now(),
          scope: "access_token",
          email: userEntity.getEmail(),
          version: userEntity.getTokenVersion(),
        },
        ACCESS_SECRET,
        {
          expiresIn: "15min",
        }
      );
      return newAccessToken;
    } catch (err) {
      throwErrs(err);
    }
  };
}
