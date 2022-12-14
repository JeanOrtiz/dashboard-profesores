import { Types, model, Schema } from "mongoose";

export interface IStudent {
  fullname: string;
  email: string;
  phoneNumber: string;
  classroom: string;
  age: number;
}
const StudentSchema = new Schema<IStudent>({
  fullname: Schema.Types.String,
  email: Schema.Types.String,
  classroom: Schema.Types.String,
  phoneNumber: Schema.Types.String,
  age: Schema.Types.Number,
});

export const Student = model<IStudent>("Student", StudentSchema);
