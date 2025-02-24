import { Email } from "../../lib/utils/createEmail";

export type UserRoles = "admin" | "manager" | "associate";

export default class User {
  private password: string;
  private email: Email;
  private role: UserRoles;
  private verifiedAt: Date | null;

  constructor(email: Email, password: string) {
    this.email = email;
    this.password = password;
    this.role = "associate";
    this.verifiedAt = null;
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

  getVerifiedAt = (): Date | null => {
    return this.verifiedAt;
  };

  setVerifiedAt = (): void => {
    this.verifiedAt = new Date(Date.now());
  };
}
