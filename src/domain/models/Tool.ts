export type ToolStatus =
  | "serviceable"
  | "issued"
  | "broken"
  | "hold"
  | "calibration due"
  | "inspection due";

export default class Tool {
  private id: string;
  private name: string;
  private status: ToolStatus;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.status = "serviceable";
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

  public changeStatus = (newStatus: ToolStatus): void => {
    this.status = newStatus;
  };
}
