export default interface CRUDService<DTO, Entity> {
  create(dto: DTO): Promise<void>;
  update(id: string, dto: DTO): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Entity>;
  findAll(): Promise<Entity[]>;
}
