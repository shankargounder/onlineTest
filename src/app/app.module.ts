import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { SearchTestComponent } from './search-test/search-test.component';
import { PdfTestComponent } from './pdf-test/pdf-test.component';
import { HeaderComponent } from './header/header.component';
import { AttendTestComponent } from './attend-test/attend-test.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchTestComponent,
    PdfTestComponent,
    HeaderComponent,
    AttendTestComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
