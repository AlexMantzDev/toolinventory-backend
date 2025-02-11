import Employee from "./Employee";

export type UserRoles = "Admin" | "Manager" | "User";

export default class User extends Employee {
  private password: string;
  private role: UserRoles;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    password: string,
    role: UserRoles
  ) {
    super(id, firstName, lastName);
    this.password = password;
    this.role = role;
  }

  getPassword = (): string => {
    return this.password;
  };

  getRole = (): UserRoles => {
    return this.role;
  };

  setPassword = (password: string): void => {
    this.password = password;
  };

  setRole = (role: UserRoles): void => {
    this.role = role;
  };
}
