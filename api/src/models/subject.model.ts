import { Types, model, Schema } from "mongoose";

export interface ISubject {
  name: string;
  teacher: string;
  schedule: string;
}
const SubjectSchema = new Schema<ISubject>({
  name: Schema.Types.String,
  teacher: Schema.Types.String,
  schedule: Schema.Types.String,
});

export const Subject = model<ISubject>("Subject", SubjectSchema);
