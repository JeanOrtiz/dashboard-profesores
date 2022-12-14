import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "../interfaces/subject.interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SubjectsService {
  // Url of the API to work with.
  URL = environment.apiUrl;
  environ;
  constructor(private http: HttpClient) {}

  // All for methods below return cold observables.

  getSubjects() {
    return this.http.get<Subject[]>(`${this.URL}/subjects`);
  }

  saveSubject(subject: Subject) {
    return this.http.post<{ ok: boolean; addedSubject: Subject }>(
      `${this.URL}/subjects/`,
      subject
    );
  }

  updateSubject(id: string, data: Partial<Subject>) {
    return this.http.put<{
      ok: boolean;
      updatedSubject: Subject;
    }>(`${this.URL}/subjects/${id}`, data);
  }

  deleteSubject(id: string) {
    return this.http.delete<any>(`${this.URL}/subjects/${id}`);
  }
}
