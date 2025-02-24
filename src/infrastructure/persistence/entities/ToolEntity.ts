import { ToolStatus, ToolType } from "../../../domain/models/Tool";

export default class ToolEntity {
  constructor(
    private id: number,
    private code: string,
    private name: string,
    private status: ToolStatus,
    private type: ToolType,
    private parentId: number | null,
    private location: string | null,
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

  public getType = (): ToolType => {
    return this.type;
  };

  public getParentId = (): number | null => {
    return this.parentId;
  };

  public getLocation = (): string | null => {
    return this.location;
  };

  public getCreatedAt = (): Date => {
    return this.createdAt;
  };

  public getUpdatedAt = (): Date => {
    return this.updatedAt;
  };
}
