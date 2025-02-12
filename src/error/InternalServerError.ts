import CustomError from "./CustomError";

export default class InternalServerError extends CustomError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}
