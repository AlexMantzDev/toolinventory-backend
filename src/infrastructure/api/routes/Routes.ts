import { Router } from "express";

export default interface Routes {
  get router(): Router;
}
