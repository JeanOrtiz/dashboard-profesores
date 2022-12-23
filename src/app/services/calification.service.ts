import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Calification } from "../interfaces/calification.interface";

@Injectable({
  providedIn: "root",
})
export class CalificationService {
  getCalifications() {
    throw new Error("Method not implemented.");
  }
  // Url of the API to work with.
  URL = environment.apiUrl;
  environ;
  constructor(private http: HttpClient) { }

  // All for methods below return cold observables.

  getCalification() {
    return this.http.get<Calification[]>(`${this.URL}/califications`);
  }

  saveCalification(calification: Calification) {
    return this.http.post<{
      addedCalification: any; ok: boolean; addedCalifications: Calification 
}>(
      `${this.URL}/califications/`,
      calification
    );
  }

  updateCalification(id: string, data: Partial<Calification>) {
    return this.http.put<{
      updatedCalification: any;
      ok: boolean;
      updatedCalifications: Calification;
    }>(`${this.URL}/calification/${id}`, data);
  }

  deleteCalification(id: string) {
    return this.http.delete<any>(`${this.URL}/califications/${id}`);
  }
}
