import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import Tool from "../models/Tool";
import GenericDAO from "./GenericDAO";

export default interface ToolDAO extends GenericDAO<Tool, ToolEntity> {}
