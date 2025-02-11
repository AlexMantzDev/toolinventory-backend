import Tool from "./Tool";

export default class Employee {
  private id: string;
  private firstName: string;
  private lastName: string;
  private organization?: string;
  private phoneNumber?: string;
  private email?: string;

  private issuedTools: Tool[] = [];

  constructor(id: string, firstName: string, lastName: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
