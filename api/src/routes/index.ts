import { Router, Request, Response } from "express";
import cors from "cors";
import { app } from "../app";
import { studentRoutes } from "./student.route";
import { subjectRoutes } from "./subject.route";
import { attendanceRoutes } from "./attendance.route";
const router = Router();

// Cors Configuration
const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:4200"],
  allowedHeaders: ["content-type", "content-length"],
  exposedHeaders: [],
};

// Here we define all the routes related to the api part of this server.
export function routeAPI() {
  router.get("/", (req: Request, res: Response) => {
    res.send("API is up and running!");
  });

  router.use("/students", studentRoutes);
  router.use("/subjects", subjectRoutes);
  router.use("/attendance", attendanceRoutes);

  app.use("/api", cors(corsOptions), router);
}
