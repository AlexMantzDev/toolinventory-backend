import Tool from "../models/Tool";

export default interface GenericDAO<T, TEntity> {
  save(tool: T): Promise<void>;
  getById(id: string): Promise<TEntity | null>;
  getAll(): Promise<TEntity[]>;
  update(id: string, tool: Tool): Promise<void>;
  delete(id: string): Promise<void>;
}
