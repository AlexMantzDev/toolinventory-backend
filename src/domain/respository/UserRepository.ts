import UserEntity from "../../infrastructure/persistence/entities/UserEntity";
import User from "../models/User";
import CRUDRepository from "./CRUDRepository";

export default interface UserRepository
  extends CRUDRepository<User, UserEntity> {
  getByEmail(email: string): Promise<UserEntity | null>;
}
