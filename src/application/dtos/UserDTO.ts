import { Email } from "../../lib/utils/createEmail";

export default interface UserDTO {
  email: Email;
  password: string;
}
