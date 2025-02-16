import NotFoundError from "../../error/NotFoundError";
import Tool from "./Tool";

export default class Employee {
  private id: string;
  private firstName: string;
  private lastName: string;
  private tools: Tool[];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    tools: Tool[] = []
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.tools = tools;
  }

  getId(): string {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getTools(): Tool[] {
    return this.tools;
  }

  issueTool(tool: Tool): void {
    this.tools.push(tool);
  }

  returnTool(toolId: string): void {
    for (let i = 0; i < this.tools.length; i++) {
      if (this.tools[i].getId() === toolId) {
        this.tools.splice(i, 1);
      } else {
        throw new NotFoundError("Could not find tool with id: " + toolId);
      }
    }
  }
}
