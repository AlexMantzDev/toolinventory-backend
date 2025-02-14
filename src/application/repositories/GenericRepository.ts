export default interface GenericRepository<T, TEntity> {
  save(t: T): Promise<void>;
  getById(id: string): Promise<TEntity>;
  getAll(): Promise<TEntity[]>;
  update(id: string, t: T): Promise<void>;
  delete(id: string): Promise<void>;
}
