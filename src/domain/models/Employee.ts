export default class Employee {
  private code: string;
  private firstName: string;
  private lastName: string;

  constructor(code: string, firstName: string, lastName: string) {
    this.code = code;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public getCode = (): string => {
    return this.code;
  };

  public getFirstName = (): string => {
    return this.firstName;
  };

  public getLastName = (): string => {
    return this.lastName;
  };
}
