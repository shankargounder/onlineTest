import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SearchTestComponent } from './search-test/search-test.component';
import { PdfTestComponent } from './pdf-test/pdf-test.component';
import { AttendTestComponent } from './attend-test/attend-test.component';

const routes: Routes = [
  // { path: 'login', component: LoginComponent},
  { path: 'search-test', component: SearchTestComponent},
  { path: 'pdf-test', component: PdfTestComponent},
  { path: 'attend-test', component: AttendTestComponent},
  { path: '', redirectTo: 'pdf-test', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}