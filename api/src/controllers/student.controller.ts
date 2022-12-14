import { Request, Response } from "express";
import { Student } from "../models";

// CRUD operations of the Student Model.
export class StudentCtrl {
  // get all the students
  static async get(req: Request, res: Response) {
    const students = await Student.find().lean();

    res.json(students);
  }

  // add a new student
  static post(req: Request, res: Response) {
    console.log("student");

    const { fullname, email, phoneNumber, age, classroom } = req.body;
    const student = new Student({
      fullname,
      email,
      phoneNumber,
      age,
      classroom,
    });
    student
      .save()
      .then((addedStudent) => {
        console.log(addedStudent);
        res.json({ ok: true, addedStudent });
      })
      .catch((err) => {
        console.log(err);
        res.json({ ok: false, err });
      });
  }

  // update a student by its Id
  static async put(req: Request, res: Response) {
    const { id } = req.params;

    // TODO: Field Validation.
    //

    Student.findOne({ _id: id }).then((student) => {
      if (student) {
        // The new attribute is needed in order to return the updated student.
        Student.findOneAndUpdate({ _id: id }, req.body, { new: true })
          .then((updatedStudent) => {
            res.json({ ok: true, updatedStudent });
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

  // Delete a student by its ID
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    Student.deleteOne({ _id: id }).then((info) => {
      res.json(info);
    });
  }
}
