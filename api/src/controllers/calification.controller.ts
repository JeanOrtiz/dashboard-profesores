import { Request, Response } from "express";
import { Calification } from "../models";

// CRUD operations of the Student Model.
export class CalificationCtrl {
  // get all the students
  static async get(req: Request, res: Response) {
    const califications = await Calification.find().lean();

    res.json(califications);
  }

  // add a new calification
  static post(req: Request, res: Response) {
    console.log("calification");

    const { fullname, matematicas, español, ciencias_sociales, ciencias_naturales } = req.body;
    const calification = new Calification({
      fullname,
      matematicas,
      español,
      ciencias_sociales,
      ciencias_naturales,
    });
    calification
      .save()
      .then((addedCalification: any) => {
        console.log(addedCalification);
        res.json({ ok: true, addedCalification });
      })
      .catch((err: any) => {
        console.log(err);
        res.json({ ok: false, err });
      });
  }

  // update a calification by its Id
  static async put(req: Request, res: Response) {
    const { id } = req.params;

    // TODO: Field Validation.
    //

    Calification.findOne({ _id: id }).then((calification: any) => {
      if (calification) {
        // The new attribute is needed in order to return the updated student.
        Calification.findOneAndUpdate({ _id: id }, req.body, { new: true })
          .then((updatedCalification: any) => {
            res.json({ ok: true, updatedCalification });
          })
          .catch((err: { message: any; }) => {
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
    Calification.deleteOne({ _id: id }).then((info: any) => {
      res.json(info);
    });
  }
}
