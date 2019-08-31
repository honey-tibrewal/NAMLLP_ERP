import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { JobsComponent } from './jobManagement/jobs.component';
import { LeavesComponent } from './leaveManagement/leave.component';
import { TimesheetComponent } from './timesheetManagement/timesheet.component';
import { HomeComponent } from './home/home.component';
import { FirebaseService } from './services/firebase.service';
import { ExcelService } from './services/excel.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeesComponent } from './employees/employees.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from './services/user.service';
import { AuthGuard } from './services/auth.guard';
import {AuthService } from './services/auth.service';
import { UserComponent} from './user/user.component';
import { UserResolver } from './user/user.resolver';
import { LoginComponent} from './login/login.component';
import { AngularFireAuthModule } from '@angular/fire/auth';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatOptionModule
} from '@angular/material'

const modules = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatOptionModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    JobsComponent,
    LeavesComponent,
    TimesheetComponent,
    HomeComponent,
    EmployeesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    ModalModule.forRoot(),
    modules,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    PaginationModule.forRoot(),
    AngularFireAuthModule
  ],
  providers: [AuthGuard, UserService, AuthService, UserResolver,FirebaseService, ExcelService],
  bootstrap: [AppComponent],
  exports:[modules]
})
export class AppModule { }
