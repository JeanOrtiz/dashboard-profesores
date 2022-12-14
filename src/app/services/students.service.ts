import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Student } from "../interfaces/student.interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class StudentsService {
  // Url of the API to work with.
  URL = environment.apiUrl;
  environ;
  constructor(private http: HttpClient) { }

  // All for methods below return cold observables.

  getStudents() {
    return this.http.get<Student[]>(`${this.URL}/students`);
  }

  saveStudent(student: Student) {
    return this.http.post<{ ok: boolean; addedStudent: Student }>(
      `${this.URL}/students/`,
      student
    );
  }

  updateStudent(id: string, data: Partial<Student>) {
    return this.http.put<{
      ok: boolean;
      updatedStudent: Student;
    }>(`${this.URL}/students/${id}`, data);
  }

  deleteStudent(id: string) {
    return this.http.delete<any>(`${this.URL}/students/${id}`);
  }
}
