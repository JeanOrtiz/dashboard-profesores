import { Router } from "express";
import { StudentCtrl } from "../controllers";

export const studentRoutes = Router();

studentRoutes
  .route("/:id?")
  .get(StudentCtrl.get)
  .post(StudentCtrl.post)
  .put(StudentCtrl.put)
  .delete(StudentCtrl.delete);
