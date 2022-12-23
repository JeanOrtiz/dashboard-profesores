import { Types, model, Schema } from "mongoose";

export interface ICalification {
  fullname: string;
  matematicas: number;
  español: number;
  ciencias_sociales: number;
  ciencias_naturales: number;
  classroom: string;
}
const CalificationSchema = new Schema<ICalification>({
  fullname: Schema.Types.String,
  classroom: Schema.Types.String,
  matematicas: Schema.Types.Number,
  español: Schema.Types.Number,
  ciencias_sociales: Schema.Types.Number,
  ciencias_naturales: Schema.Types.Number,
});

export const Calification = model<ICalification>("Calification", CalificationSchema);
