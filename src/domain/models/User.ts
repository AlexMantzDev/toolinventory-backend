import { Email } from "../../lib/utils/createEmail";

export type UserRoles = "admin" | "manager" | "associate";

export default class User {
  private password: string;
  private email: Email;
  private role: UserRoles;
  private isAllowed: boolean;
  private verifiedAt: Date | null;
  private tokenVersion: number;

  constructor(
    email: Email,
    password: string,
    role: UserRoles = "associate",
    isAllowed: boolean = true,
    verifiedAt: Date | null = null,
    tokenVersion: number = 1
  ) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.isAllowed = isAllowed;
    this.verifiedAt = verifiedAt;
    this.tokenVersion = tokenVersion;
  }

  getEmail = (): Email => {
    return this.email;
  };

  getPassword = (): string => {
    return this.password;
  };

  getRole = (): UserRoles => {
    return this.role;
  };

  getIsAllowed = (): boolean => {
    return this.isAllowed;
  };

  getVerifiedAt = (): Date | null => {
    return this.verifiedAt;
  };

  getTokenVersion = (): number => {
    return this.tokenVersion;
  };
}
