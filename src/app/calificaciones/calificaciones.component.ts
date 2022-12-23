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
import { Subscription } from "rxjs";
import { CalificationService } from "../services/calification.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormComponentBase } from "mateh-ng-m-validation";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";
import { SubSink } from "subsink";
import { Calification } from "../interfaces/calification.interface";
@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss']
})
export class CalificationsComponent
  extends FormComponentBase
  implements OnInit, AfterViewInit, OnDestroy {
  calificationForm: FormGroup;
  private subs = new SubSink();

  // Open modal button
  @ViewChild("modalTrigger", { static: false, read: ElementRef })
  modalTrigger: ElementRef;

  // Table and options
  @ViewChild(NgMDatatable)
  Datatable: NgMDatatable<Calification>;
  ngMDatatableOptions: NgMDatatableOptions<Calification> = {
    title: "Materias",
    columns: [
      { id: "fullname", text: "Nombre" },
      { id: "matematicas", text: "Matematicas" },
      { id: "español", text: "Español" },
      { id: "ciencias_sociales", text: "Ciencias Sociales" },
      { id: "ciencias_naturales", text: "Ciencias Naturales" },
      { id: "classroom", text: "ClassRoom" },
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
                  this.deleteCalification(data._id);
                }
              });
            },
          },
        ],
      },
    ],
    displayedColumns: ["fullname", "matematicas", "español", "ciencias_sociales", "ciencias_naturales", "classroom", "action"],
    addButton: {
      icon: "add",
      handler: () => {
        this.showForm();
      },
    },
  };
  title = "califications-crud";
  mode: "add" | "edit";
  selectedID: string;

  data: Array<Calification> = [];

  // Form Creation and Validation Objects
  validationMessages = {
    full_name: {
      required: "Full Name is required",
    },
    matematicas: {
      required: "Teacher is required",
    },
    español: {
      required: "Schedule is required",
    },
    ciencias_sociales: {
      required: "Schedule is required",
    },
    ciencias_naturales: {
      required: "Schedule is required",
    },
    classroom: {
      required: "Schedule is required",
    },
  };

  formErrors = {
    fullname: "",
    matematicas: "",
    español: "",
    ciencias_sociales: "",
    classroom: "",
    ciencias_naturales: "", //This field will be used to present server errors into the template
  };

  constructor(
    private api: CalificationService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    super();
    this.initForm();
  }

  ngOnInit() {
    this.subs.sink = this.api.getCalification().subscribe((califications) => {
      this.data = califications.map<Calification>((c) => ({
        _id: c._id,
        fullname: c.fullname,
        matematicas: c.matematicas,
        español: c.español,
        ciencias_sociales: c.ciencias_sociales,
        ciencias_naturales: c.ciencias_naturales,
        classroom: c.classroom,
      }));
    });
  }

  // Inits the calification form with with default data when adding and Real data when editting
  initForm(c?: Calification) {
    this.mode = !c ? "add" : "edit";
    this.calificationForm = this.fb.group({
      fullname: [!!c ? c.fullname : "", [Validators.required]],
      matematicas: [!!c ? c.matematicas : "", [Validators.required]],
      español: [!!c ? c.español : "", [Validators.required]],
      ciencias_sociales: [!!c ? c.ciencias_sociales : "", [Validators.required]],
      ciencias_naturales: [!!c ? c.ciencias_naturales : "", [Validators.required]],
      classroom: [!!c ? c.classroom : "", [Validators.required]],
    });

    if (!c) this.calificationForm.reset();
  }

  // Init form and start monitoring controls for errors.
  showForm(c?: Calification) {
    this.initForm(c);
    this.modalTrigger.nativeElement.click();
    this.startControlMonitoring(this.calificationForm);
  }

  ngAfterViewInit() { }

  // Add and Edit logic
  saveCalification() {
    if (this.calificationForm.valid) {
      const v = this.calificationForm.value;
      const calification: Calification = {
        _id: "",
        fullname: v.fullname,
        matematicas: v.matematicas,
        español: v.español,
        ciencias_naturales: v.ciencias_naturales,
        ciencias_sociales: v.ciencias_sociales,
        classroom: v.string
      };

      if (this.mode == "add") {
        this.subs.sink = this.api.saveCalification(calification).subscribe(
          (res) => {
            console.log(res);
            if (res.ok) {
              this.data = [
                ...this.data,
                {
                  _id: res.addedCalification._id,
                  fullname: res.addedCalification.fullname,
                  matematicas: res.addedCalification.matematicas,
                  español: res.addedCalification.español,
                  ciencias_naturales: res.addedCalification.ciencias_naturales,
                  ciencias_sociales: res.addedCalification.ciencias_sociales,
                  classroom: res.addedCalification.classroom,
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
        delete calification._id;
        this.subs.sink = this.api
          .updateCalification(this.selectedID, calification)
          .subscribe(
            (res) => {
              console.log(res);
              if (res.ok) {
                const index = this.data.findIndex(
                  (x) => x._id == res.updatedCalification._id
                );
                this.data[index] = {
                  _id: res.updatedCalification._id,
                  fullname: res.updatedCalification.fullname,
                  matematicas: res.updatedCalification.matematicas,
                  español: res.updatedCalification.español,
                  ciencias_naturales: res.updatedCalification.ciencias_naturales,
                  ciencias_sociales: res.updatedCalification.ciencias_sociales,
                  classroom: res.updatedCalification.classroom,
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

  deleteCalification(id: string) {
    this.subs.sink = this.api.deleteCalification(id).subscribe(
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
