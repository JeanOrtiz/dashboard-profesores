import { Types, model, Schema } from "mongoose";

export interface IGrade {
  fullname: string;
  email: string;
  classroom: string;
  age: number;
}
const GradeSchema = new Schema<IGrade>({
  fullname: Schema.Types.String,
  email: Schema.Types.String,
  classroom: Schema.Types.String,
  age: Schema.Types.Number,
});

export const Grade = model<IGrade>("Grade", GradeSchema);
