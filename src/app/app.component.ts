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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormComponentBase } from "mateh-ng-m-validation";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "./components/dialog/dialog.component";
import { SubSink } from "subsink";

// Data pressented in the Datatable

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {}
