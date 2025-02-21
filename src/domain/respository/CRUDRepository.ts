export default interface CRUDRepository<T, Entity> {
  save(t: T): Promise<void>;
  getById(id: number): Promise<Entity | null>;
  getAll(): Promise<Entity[]>;
  update(id: number, t: T): Promise<void>;
  delete(id: number): Promise<void>;
}
