import { Request, Response } from "express";
import { Attendance } from "../models";

// CRUD operations of the Attendance Model.
export class AttendanceCtrl {
  // get all the attendance records
  static async get(req: Request, res: Response) {
    const attendanceRecords = await Attendance.find().populate('students').lean();

    res.json(attendanceRecords);
  }

  // add a new attendance
  static post(req: Request, res: Response) {
    console.log("attendance");

    const { date, students } = req.body;
    const attendance = new Attendance({
      date,
      students,
    });
    attendance
      .save()
      .then((addedAttendance) => {
        console.log(addedAttendance);
        res.json({ ok: true, addedAttendance });
      })
      .catch((err) => {
        console.log(err);
        res.json({ ok: false, err });
      });
  }

  // update a attendance by its Id
  static async put(req: Request, res: Response) {
    const { id } = req.params;
    const { students } = req.body;
    // TODO: Field Validation.
    //

    Attendance.findOne({ _id: id }).then((attendance) => {
      if (attendance) {
        // The new attribute is needed in order to return the updated attendance.
        Attendance.findOneAndUpdate({ _id: id }, { students }, { new: true })
          .then((updatedAttendance) => {
            res.json({ ok: true, updatedAttendance });
          })
          .catch((err) => {
            console.log(err.message);
            res.json({ ok: false, err });
          });
      } else {
        res.json({ ok: false });
      }
    });
  }

  // Delete a attendance by its ID
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    Attendance.deleteOne({ _id: id }).then((info) => {
      res.json(info);
    });
  }
}
