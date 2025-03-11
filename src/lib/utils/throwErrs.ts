import CustomError from "../../error/CustomError";
import InternalServerError from "../../error/InternalServerError";

export function throwErrs(err: unknown): never {
  console.error(err);
  if (err instanceof CustomError) {
    throw err;
  }
  throw new InternalServerError("Internal server error.");
}
