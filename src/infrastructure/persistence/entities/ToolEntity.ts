import { ToolStatus } from "../../../domain/models/Tool";

export default class ToolEntity {
  constructor(
    private id: string,
    private name: string,
    private status: ToolStatus,
    private createdAt: Date,
    private updatedAt: Date
  ) {
    (this.id = id),
      (this.name = name),
      (this.status = status),
      (this.createdAt = createdAt),
      (this.updatedAt = updatedAt);
  }

  public getId = (): string => {
    return this.id;
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
