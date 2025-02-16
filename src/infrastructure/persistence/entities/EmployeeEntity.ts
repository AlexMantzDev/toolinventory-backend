import Tool from "../../../domain/models/Tool";

export default class EmployeeEntity {
  constructor(
    private id: string,
    private firstName: string,
    private lastName: string,
    private tools: Tool[],
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  public getId = (): string => {
    return this.id;
  };

  public getFirstName = (): string => {
    return this.firstName;
  };

  public getLastName = (): string => {
    return this.lastName;
  };

  public getTools = (): Tool[] => {
    return this.tools;
  };

  public getCreatedAt = (): Date => {
    return this.createdAt;
  };

  public getUpdatedAt = (): Date => {
    return this.updatedAt;
  };
}
