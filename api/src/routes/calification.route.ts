import { Router } from "express";
import { CalificationCtrl } from "../controllers";

export const calificationRoutes = Router();

calificationRoutes
  .route("/:id?")
  .get(CalificationCtrl.get)
  .post(CalificationCtrl.post)
  .put(CalificationCtrl.put)
  .delete(CalificationCtrl.delete);
