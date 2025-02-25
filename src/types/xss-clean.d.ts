declare module "xss-clean" {
  import { RequestHandler } from "express";

  export interface XssCleanOptions {}

  function xssClean(options?: XssCleanOptions): RequestHandler;

  export default xssClean;
}
