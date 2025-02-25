export type ToolStatus =
  | "serviceable"
  | "issued"
  | "broken"
  | "hold"
  | "calibration due"
  | "inspection due";

export type ToolType = "single" | "parent" | "child";

export default class Tool {
  private code: string;
  private name: string;
  private status: ToolStatus;
  private type: ToolType;
  private parentId: number | null;
  private location: string | null;

  constructor(
    code: string,
    name: string,
    parentId: number | null = null,
    location: string | null = null,
    type: ToolType = "single",
    status: ToolStatus = "serviceable"
  ) {
    this.code = code;
    this.name = name;
    this.parentId = parentId;
    this.location = location;
    this.type = type;
    this.status = status;
  }

  public setType(type: ToolType): void {
    this.type = type;
  }

  public setParentId(parentId: number): void {
    this.parentId = parentId;
  }

  public setLocation(location: string): void {
    this.location = location;
  }

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
}
