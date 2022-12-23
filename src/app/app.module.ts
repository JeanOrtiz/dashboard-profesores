import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatGridListModule } from "@angular/material/grid-list";
import { NgMDatatableModule } from "mateh-ng-m-datatable";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { DialogComponent } from "./components/dialog/dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { AsistenciaComponent } from "./asistencia/asistencia.component";
import { SubjectsComponent } from "./subjects/subjects.component";
import { CalificationsComponent } from "./calificaciones/calificaciones.component";
import { HomeComponent } from "./home/home.component";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { MatListModule } from "@angular/material/list";
import {MatIconModule} from '@angular/material/icon';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    AsistenciaComponent,
    SubjectsComponent,
    CalificationsComponent,
    HomeComponent,
  ],
  imports: [
    MatListModule,
    BrowserModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    ReactiveFormsModule,
    CdkAccordionModule,
    BrowserAnimationsModule,
    NgMDatatableModule,
    MatToolbarModule,
    MatGridListModule,
    RouterModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule ],
    
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
