import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
} from "@angular/core";
import {
  NgMDatatable,
  TextColumn,
  ActionColumn,
  NgMDatatableOptions,
} from "mateh-ng-m-datatable";
import { StudentsService } from "../services/students.service";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormComponentBase } from "mateh-ng-m-validation";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";
import { SubSink } from "subsink";
import { Student } from "../interfaces/student.interface";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent
  extends FormComponentBase
  implements OnInit, AfterViewInit, OnDestroy
{
  private subs = new SubSink();

  // Open modal button
  @ViewChild("modalTrigger", { static: false, read: ElementRef })
  modalTrigger: ElementRef;

  // Table and options
  @ViewChild(NgMDatatable)
  Datatable: NgMDatatable<Student>;
  ngMDatatableOptions: NgMDatatableOptions<Student> = {
    title: "Estudiantes",
    columns: [
      { id: "fullname", text: "Name" },
      { id: "phoneNumber", text: "Phone Number" },
      { id: "email", text: "email" },
      { id: "age", text: "Age" },
      { id: "classroom", text: "Classroom" },
      {
        id: "action",
        text: "Actions",
        type: "action",
        actions: [
          {
            icon: "create",
            text: "Edit",
            handler: (data) => {
              this.selectedID = data._id;
              this.showForm(data);
            },
          },
          {
            icon: "delete",
            text: "Detele",
            handler: (data) => {
              const ref = this.dialog.open(DialogComponent, {
                width: "250px",
                data: { question: "Are you sure?" },
              });

              this.subs.sink = ref.afterClosed().subscribe((result) => {
                if (result) {
                  this.deleteStudent(data._id);
                }
              });
            },
          },
        ],
      },
    ],
    displayedColumns: [
      "fullname",
      "phoneNumber",
      "email",
      "age",
      "classroom",
      "action",
    ],
    addButton: {
      icon: "add",
      handler: () => {
        this.showForm();
      },
    },
  };
  title = "students-crud";
  mode: "add" | "edit";
  selectedID: string;

  data: Array<Student> = [];

  // Form Creation and Validation Objects
  studentForm: FormGroup;
  validationMessages = {
    fullname: {
      required: "Full Name is required",
    },
    age: {
      required: "Age is required",
    },
    classroom: {
      required: "Classroom is required",
    },
    phoneNumber: {
      required: "Phone Number is required",
    },
    email: {
      email: "Email is not well-formatted",
    },
  };

  formErrors = {
    fullname: "",
    phoneNumber: "",
    email: "",
    age: "",
    classroom: "",
    process: "", //This field will be used to present server errors into the template
  };

  constructor(
    private api: StudentsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    super();
    this.initForm();
  }

  ngOnInit() {
    this.subs.sink = this.api.getStudents().subscribe((students) => {
      this.data = students.map<Student>((c) => ({
        _id: c._id,
        email: c.email,
        fullname: c.fullname,
        age: c.age,
        classroom: c.classroom,
        phoneNumber: c.phoneNumber,
      }));
    });
  }

  // Inits the student form with with default data when adding and Real data when editting
  initForm(c?: Student) {
    this.mode = !c ? "add" : "edit";
    this.studentForm = this.fb.group({
      fullname: [!!c ? c.fullname : "", [Validators.required]],
      phoneNumber: [!!c ? c.phoneNumber : "", [Validators.required]],
      email: [!!c ? c.email : "", [Validators.email]],
      age: [!!c ? c.age : "", [Validators.required]],
      classroom: [!!c ? c.classroom : "", [Validators.required]],
    });

    if (!c) this.studentForm.reset();
  }

  // Init form and start monitoring controls for errors.
  showForm(c?: Student) {
    this.initForm(c);
    this.modalTrigger.nativeElement.click();
    this.startControlMonitoring(this.studentForm);
  }

  ngAfterViewInit() {}

  // Add and Edit logic
  saveStudent() {
    if (this.studentForm.valid) {
      const v = this.studentForm.value;
      const student: Student = {
        _id: "",
        email: v.email,
        fullname: v.fullname,
        phoneNumber: v.phoneNumber,
        age: v.age,
        classroom: v.classroom,
      };

      if (this.mode == "add") {
        this.subs.sink = this.api.saveStudent(student).subscribe(
          (res) => {
            console.log(res);
            if (res.ok) {
              this.data = [
                ...this.data,
                {
                  _id: res.addedStudent._id,
                  email: res.addedStudent.email,
                  fullname: res.addedStudent.fullname,
                  phoneNumber: res.addedStudent.phoneNumber,
                  classroom: res.addedStudent.classroom,
                  age: res.addedStudent.age,
                },
              ];
              this.modalTrigger.nativeElement.click();
            } else {
              this.formErrors["process"] = JSON.stringify(res);
            }
          },
          (err) => {
            console.log(err);
            this.formErrors["process"] = err;
          }
        );
      } else {
        delete student._id;
        this.subs.sink = this.api
          .updateStudent(this.selectedID, student)
          .subscribe(
            (res) => {
              console.log(res);
              if (res.ok) {
                const index = this.data.findIndex(
                  (x) => x._id == res.updatedStudent._id
                );
                this.data[index] = {
                  _id: res.updatedStudent._id,
                  email: res.updatedStudent.email,
                  fullname: res.updatedStudent.fullname,
                  phoneNumber: res.updatedStudent.phoneNumber,
                  classroom: res.updatedStudent.classroom,
                  age: res.updatedStudent.age,
                };

                this.data = [...this.data];
                this.modalTrigger.nativeElement.click();
                this.selectedID = "";
              } else {
                this.formErrors["process"] = JSON.stringify(res);
              }
            },
            (err) => {
              console.log(err);
              this.formErrors["process"] = err.message;
            }
          );
      }
    }
  }

  deleteStudent(id: string) {
    this.subs.sink = this.api.deleteStudent(id).subscribe(
      (res) => {
        console.log(res);
        if (res.ok) {
          const index = this.data.findIndex((x) => x._id == id);
          console.log("index", index);
          this.data.splice(index, 1);
          this.data = [...this.data];
        } else {
          this.formErrors["process"] = JSON.stringify(res);
        }
      },
      (err) => {
        console.log(err);
        this.formErrors["process"] = JSON.stringify(err.message);
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe all supscriptions of the component
    this.subs.unsubscribe();
  }
}
