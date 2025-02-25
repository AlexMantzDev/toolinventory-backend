import Tool, { ToolStatus } from "./Tool";

export default class Toolbox extends Tool {
  public constructor(code: string, name: string) {
    super(code, name);
    this.setType("parent");
  }
}
