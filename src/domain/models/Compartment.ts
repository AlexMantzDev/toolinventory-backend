import Tool from "./Tool";

export default class Compartment {
  private name: string;
  private tools: Tool[] = [];

  public constructor(name: string) {
    this.name = name;
  }

  public getName = (): string => {
    return this.name;
  };

  public getTools = (): Tool[] => {
    return this.tools;
  };

  public setName = (name: string): void => {
    this.name = name;
  };

  public addTool(tool: Tool) {
    this.tools.push(tool);
  }

  // public removeTool(toolId: string) {
  //   const tool: = this.tools.find((e) => e.getId() === toolId);
  //   if (!tool) return;
  //   const toolIndex = this.tools.indexOf(tool);
  //   this.tools.splice(toolIndex, 1);
  // }
}
