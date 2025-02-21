export default interface CRUDService<DTO, Entity> {
  create(dto: DTO): Promise<void>;
  update(id: number, dto: DTO): Promise<void>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Entity>;
  findAll(): Promise<Entity[]>;
}
