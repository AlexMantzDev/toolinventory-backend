export type ToolStatus =
  | "serviceable"
  | "issued"
  | "broken"
  | "hold"
  | "calibration due"
  | "inspection due";

export default class Tool {
  private code: string;
  private name: string;
  private status: ToolStatus;

  constructor(code: string, name: string, status: ToolStatus) {
    this.code = code;
    this.name = name;
    this.status = status;
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

  public changeStatus = (status: ToolStatus): void => {
    this.status = status;
  };
}
