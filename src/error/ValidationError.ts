import CustomError from "./CustomError";

export default class ValidationError extends CustomError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}
