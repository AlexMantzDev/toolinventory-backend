import { ToolStatus } from "../../../domain/models/Tool";

export default class ToolEntity {
  constructor(
    private id: number,
    private code: string,
    private name: string,
    private status: ToolStatus,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  public getId = (): number => {
    return this.id;
  };

  public getCode = (): string => {
    return this.code;
  };

  public getName = (): string => {
    return this.name;
  };

  public getStatus = (): ToolStatus => {
    return this.status;
  };

  public getCreatedAt = (): Date => {
    return this.createdAt;
  };

  public getUpdatedAt = (): Date => {
    return this.updatedAt;
  };
}
