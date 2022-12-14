import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Attendance } from "../interfaces/attendance.interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AttendanceService {
  // Url of the API to work with.
  URL = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  // All for methods below return cold observables.

  getAttendance() {
    return this.http.get<Attendance[]>(`${this.URL}/attendance`);
  }

  saveAttendance(attendance: Attendance) {
    return this.http.post<{ ok: boolean; addedAttendance: Attendance }>(
      `${this.URL}/attendance/`,
      attendance
    );
  }

  updateAttendance(id: string, data: Partial<Attendance>) {
    return this.http.put<{
      ok: boolean;
      updatedAttendance: Attendance;
    }>(`${this.URL}/attendance/${id}`, data);
  }

  deleteAttendance(id: string) {
    return this.http.delete<any>(`${this.URL}/attendance/${id}`);
  }
}
