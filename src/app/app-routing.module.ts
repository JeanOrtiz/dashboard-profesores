import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { CalificationsComponent } from "./calificaciones/calificaciones.component";
import { SubjectsComponent } from "./subjects/subjects.component";
import { AsistenciaComponent } from "./asistencia/asistencia.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "grades",
    component: CalificationsComponent,
  },
  {
    path: "subjects",
    component: SubjectsComponent,
  },
  {
    path: "attendance",
    component: AsistenciaComponent,
  },
  { path: "**", redirectTo: "home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
