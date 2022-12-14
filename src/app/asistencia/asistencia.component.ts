import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AttendanceService } from "../services/attendance.service";
import { SubSink } from "subsink";
import { Attendance } from "../interfaces/attendance.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StudentsService } from "../services/students.service";
import { Student } from "../interfaces/student.interface";
import { MatSelectionList } from "@angular/material/list";

@Component({
  selector: "app-asistencia",
  templateUrl: "./asistencia.component.html",
  styleUrls: ["./asistencia.component.scss"],
})
export class AsistenciaComponent implements OnInit {
  students: Student[] = [];
  attendanceRecords: Attendance[] = [];

  // Open modal button

  @ViewChild("modalTrigger", { static: false, read: ElementRef }) modalTrigger: ElementRef;;
  @ViewChild("studentsInput") studentsInput: MatSelectionList;
  private subs = new SubSink();
  mode: "add" | "edit" = 'add';
  selectedID: string;
  date = new Date().toDateString();

  constructor(private studentsService: StudentsService, private attendanceService: AttendanceService, private fb: FormBuilder) {
  }


  ngOnInit(): void {

    this.subs.sink = this.attendanceService.getAttendance().subscribe((attendance) => {
      this.attendanceRecords = attendance;
    });

    this.subs.sink = this.studentsService.getStudents().subscribe((students) => {
      this.students = students;
    });
  }

  openDialog() {
    this.modalTrigger.nativeElement.click();
  }

  saveAttendance() {
    console.log(this.studentsInput.selectedOptions.selected)
    if (this.date) {
      const attendance: Attendance = {
        _id: '',
        date: this.date,
        students: this.studentsInput.selectedOptions.selected.map((x) => x.value),
      }

      if (this.mode == "add") {
        this.subs.sink = this.attendanceService.saveAttendance(attendance).subscribe(
          (res) => {
            console.log(res);
            if (res.ok) {
              this.attendanceRecords = [
                ...this.attendanceRecords,
                {
                  _id: res.addedAttendance._id,
                  date: res.addedAttendance.date,
                  students: res.addedAttendance.students,
                },
              ];
              this.modalTrigger.nativeElement.click();
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        delete attendance._id;
        this.subs.sink = this.attendanceService
          .updateAttendance(this.selectedID, attendance)
          .subscribe(
            (res) => {
              console.log(res);
              if (res.ok) {
                const index = this.attendanceRecords.findIndex(
                  (x) => x._id == res.updatedAttendance._id
                );
                this.attendanceRecords[index] = {
                  _id: res.updatedAttendance._id,
                  date: res.updatedAttendance.date,
                  students: res.updatedAttendance.students,
                };

                this.attendanceRecords = [...this.attendanceRecords];
                this.modalTrigger.nativeElement.click();
                this.selectedID = "";
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
    }
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
