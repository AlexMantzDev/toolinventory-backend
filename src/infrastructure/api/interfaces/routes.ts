import { Router } from "express";
import Controller from "./controller";

export default interface Routes {
  get controller(): Controller;
  get router(): Router;
}
