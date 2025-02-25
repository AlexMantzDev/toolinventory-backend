import { UserRoles } from "../../../domain/models/User";
import { Email } from "../../../lib/utils/createEmail";

export default class UserEntity {
  constructor(
    private id: number,
    private email: Email,
    private password: string,
    private role: UserRoles,
    private isAllowed: boolean,
    private verifiedAt: Date | null,
    private tokenVersion: number,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  public getId = (): number => {
    return this.id;
  };

  public getEmail = (): Email => {
    return this.email;
  };

  public getPassword = (): string => {
    return this.password;
  };

  public getRole = (): string => {
    return this.role;
  };

  public getIsAllowed = (): boolean => {
    return this.isAllowed;
  };

  public getVerifiedAt = (): Date | null => {
    return this.verifiedAt;
  };

  public getTokenVersion = (): number => {
    return this.tokenVersion;
  };

  public getCreatedAt = (): Date => {
    return this.createdAt;
  };

  public getUpdatedAt = (): Date => {
    return this.updatedAt;
  };
}
