import { Router } from "express";
import { SubjectCtrl } from "../controllers";

export const subjectRoutes = Router();

subjectRoutes
  .route("/:id?")
  .get(SubjectCtrl.get)
  .post(SubjectCtrl.post)
  .put(SubjectCtrl.put)
  .delete(SubjectCtrl.delete);
