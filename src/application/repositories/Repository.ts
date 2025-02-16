export default interface Repository<T, Entity> {
  save(t: T): Promise<void>;
  getById(id: string): Promise<Entity>;
  getAll(): Promise<Entity[]>;
  update(id: string, t: T): Promise<void>;
  delete(id: string): Promise<void>;
}
