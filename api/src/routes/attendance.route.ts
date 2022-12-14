import { Router } from "express";
import { AttendanceCtrl } from "../controllers";

export const attendanceRoutes = Router();

attendanceRoutes
  .route("/:id?")
  .get(AttendanceCtrl.get)
  .post(AttendanceCtrl.post)
  .put(AttendanceCtrl.put)
  .delete(AttendanceCtrl.delete);
