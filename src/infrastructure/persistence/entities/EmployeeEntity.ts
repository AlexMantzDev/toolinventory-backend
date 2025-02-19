export default class EmployeeEntity {
  constructor(
    private id: number,
    private code: string,
    private firstName: string,
    private lastName: string,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  public getId = (): number => {
    return this.id;
  };

  public getCode = (): string => {
    return this.code;
  };

  public getFirstName = (): string => {
    return this.firstName;
  };

  public getLastName = (): string => {
    return this.lastName;
  };

  public getCreatedAt = (): Date => {
    return this.createdAt;
  };

  public getUpdatedAt = (): Date => {
    return this.updatedAt;
  };
}
