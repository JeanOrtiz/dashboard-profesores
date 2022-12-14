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
import { SubjectsService } from "../services/subjects.service";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormComponentBase } from "mateh-ng-m-validation";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";
import { SubSink } from "subsink";
import { Subject } from "../interfaces/subject.interface";

@Component({
  selector: "app-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.scss"],
})
export class SubjectsComponent
  extends FormComponentBase
  implements OnInit, AfterViewInit, OnDestroy {
  private subs = new SubSink();

  // Open modal button
  @ViewChild("modalTrigger", { static: false, read: ElementRef })
  modalTrigger: ElementRef;

  // Table and options
  @ViewChild(NgMDatatable)
  Datatable: NgMDatatable<Subject>;
  ngMDatatableOptions: NgMDatatableOptions<Subject> = {
    title: "Materias",
    columns: [
      { id: "name", text: "Nombre" },
      { id: "teacher", text: "Maestro" },
      { id: "schedule", text: "Horario" },
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
                  this.deleteSubject(data._id);
                }
              });
            },
          },
        ],
      },
    ],
    displayedColumns: ["name", "teacher", "schedule", "action"],
    addButton: {
      icon: "add",
      handler: () => {
        this.showForm();
      },
    },
  };
  title = "subjects-crud";
  mode: "add" | "edit";
  selectedID: string;

  data: Array<Subject> = [];

  // Form Creation and Validation Objects
  subjectForm: FormGroup;
  validationMessages = {
    name: {
      required: "Full Name is required",
    },
    teacher: {
      required: "Teacher is required",
    },
    schedule: {
      required: "Schedule is required",
    },
  };

  formErrors = {
    name: "",
    teacher: "",
    schedule: "",
    process: "", //This field will be used to present server errors into the template
  };

  constructor(
    private api: SubjectsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    super();
    this.initForm();
  }

  ngOnInit() {
    this.subs.sink = this.api.getSubjects().subscribe((subjects) => {
      this.data = subjects.map<Subject>((c) => ({
        _id: c._id,
        name: c.name,
        teacher: c.teacher,
        schedule: c.schedule,
      }));
    });
  }

  // Inits the subject form with with default data when adding and Real data when editting
  initForm(c?: Subject) {
    this.mode = !c ? "add" : "edit";
    this.subjectForm = this.fb.group({
      name: [!!c ? c.name : "", [Validators.required]],
      teacher: [!!c ? c.teacher : "", [Validators.required]],
      schedule: [!!c ? c.schedule : "", [Validators.required]],
    });

    if (!c) this.subjectForm.reset();
  }

  // Init form and start monitoring controls for errors.
  showForm(c?: Subject) {
    this.initForm(c);
    this.modalTrigger.nativeElement.click();
    this.startControlMonitoring(this.subjectForm);
  }

  ngAfterViewInit() { }

  // Add and Edit logic
  saveSubject() {
    if (this.subjectForm.valid) {
      const v = this.subjectForm.value;
      const subject: Subject = {
        _id: "",
        name: v.name,
        teacher: v.teacher,
        schedule: v.schedule,
      };

      if (this.mode == "add") {
        this.subs.sink = this.api.saveSubject(subject).subscribe(
          (res) => {
            console.log(res);
            if (res.ok) {
              this.data = [
                ...this.data,
                {
                  _id: res.addedSubject._id,
                  name: res.addedSubject.name,
                  teacher: res.addedSubject.teacher,
                  schedule: res.addedSubject.schedule,
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
        delete subject._id;
        this.subs.sink = this.api
          .updateSubject(this.selectedID, subject)
          .subscribe(
            (res) => {
              console.log(res);
              if (res.ok) {
                const index = this.data.findIndex(
                  (x) => x._id == res.updatedSubject._id
                );
                this.data[index] = {
                  _id: res.updatedSubject._id,
                  name: res.updatedSubject.name,
                  teacher: res.updatedSubject.teacher,
                  schedule: res.updatedSubject.schedule,
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

  deleteSubject(id: string) {
    this.subs.sink = this.api.deleteSubject(id).subscribe(
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
