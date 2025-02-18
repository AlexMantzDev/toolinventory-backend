import Compartment from "./Compartment";
import Tool, { ToolStatus } from "./Tool";

export default class Toolbox extends Tool {
  private compartments: Compartment[] = [];

  public constructor(id: string, name: string, status: ToolStatus) {
    super(id, name, status);
  }

  public addCompartment(compartmentName: string) {
    compartmentName = compartmentName.toLowerCase().trim().replace(" ", "_");
    const isValid = /^[a-zA-Z 0-9]+$/.test(compartmentName);
    if (!isValid) return;

    if (!!this.compartments.find((e) => e.getName() === compartmentName)) {
      return;
    }
    const compartment: Compartment = new Compartment(compartmentName);
    this.compartments.push(compartment);
  }

  public removeCompartment(compartmentName: string) {
    const compartment = this.compartments.find(
      (e) => e.getName() === compartmentName
    );
    if (!compartment) return;
    const index = this.compartments.indexOf(compartment);
    this.compartments.splice(index, 1);
  }
}
