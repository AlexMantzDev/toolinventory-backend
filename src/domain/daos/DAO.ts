export default interface DAO<T, Entity> {
  save(t: T): Promise<void>;
  getById(id: string): Promise<Entity | null>;
  getAll(): Promise<Entity[]>;
  update(id: string, t: T): Promise<void>;
  delete(id: string): Promise<void>;
}
