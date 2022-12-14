import { Types, model, Schema } from "mongoose";
import { IStudent } from "./student.model";

export interface IAttendance {
  date: Date;
  students: IStudent[];
}
const AttendanceSchema = new Schema<IAttendance>({
  date: Schema.Types.Date,
  students: [{ type: Types.ObjectId, ref: "Student" }],
});

export const Attendance = model<IAttendance>("Attendance", AttendanceSchema);
