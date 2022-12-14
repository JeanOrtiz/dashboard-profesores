import { Request, Response } from "express";
import { Subject } from "../models";

// CRUD operations of the Subject Model.
export class SubjectCtrl {
  // get all the subjects
  static async get(req: Request, res: Response) {
    const subjects = await Subject.find().lean();

    res.json(subjects);
  }

  // add a new subject
  static post(req: Request, res: Response) {
    console.log("subject");

    const { name, teacher, schedule } = req.body;
    const subject = new Subject({
      name,
      teacher,
      schedule,
    });
    subject
      .save()
      .then((addedSubject) => {
        console.log(addedSubject);
        res.json({ ok: true, addedSubject });
      })
      .catch((err) => {
        console.log(err);
        res.json({ ok: false, err });
      });
  }

  // update a subject by its Id
  static async put(req: Request, res: Response) {
    const { id } = req.params;

    // TODO: Field Validation.
    //

    Subject.findOne({ _id: id }).then((subject) => {
      if (subject) {
        // The new attribute is needed in order to return the updated subject.
        Subject.findOneAndUpdate({ _id: id }, req.body, { new: true })
          .then((updatedSubject) => {
            res.json({ ok: true, updatedSubject });
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

  // Delete a subject by its ID
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    Subject.deleteOne({ _id: id }).then((info) => {
      res.json(info);
    });
  }
}
