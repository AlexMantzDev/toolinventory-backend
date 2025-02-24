import Tool, { ToolStatus } from "./Tool";

export default class Toolbox extends Tool {
  public constructor(
    code: string,
    name: string,
    status: ToolStatus,
    parentId: number,
    location: string
  ) {
    super(code, name, status);
    this.setType("parent");
    this.setParentId(parentId);
    this.setLocation(location);
  }
}
