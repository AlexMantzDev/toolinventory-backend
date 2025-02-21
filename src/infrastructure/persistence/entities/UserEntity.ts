import { UserRoles } from "../../../domain/models/User";

export default class UserEntity {
  constructor(
    private id: number,
    private email: string,
    private password: string,
    private role: UserRoles,
    private verifiedAt: Date | null,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  public getId = (): number => {
    return this.id;
  };

  public getEmail = (): string => {
    return this.email;
  };

  public getPassword = (): string => {
    return this.password;
  };

  public getRole = (): string => {
    return this.role;
  };

  public getVerifiedAt = (): Date | null => {
    return this.verifiedAt;
  };

  public getCreatedAt = (): Date => {
    return this.createdAt;
  };

  public getUpdatedAt = (): Date => {
    return this.updatedAt;
  };
}
