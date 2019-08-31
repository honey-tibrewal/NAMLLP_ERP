import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsComponent } from './jobManagement/jobs.component'
import { LeavesComponent } from './leaveManagement/leave.component';
import { TimesheetComponent } from './timesheetManagement/timesheet.component';
import { HomeComponent } from './home/home.component';
import { EmployeesComponent } from './employees/employees.component';
import { LoginComponent} from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { UserComponent} from './user/user.component';
import { UserResolver } from './user/user.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent,  resolve: { data: UserResolver}, 
    children:[
        {path:'', redirectTo: 'home' , pathMatch: 'full'},
        {path:'home', component: HomeComponent},
        {path : 'jobsmngmnt', component: JobsComponent},
        {path: 'timesheetmngmnt', component: TimesheetComponent},
        {path: 'leavemngmnt', component: LeavesComponent},
        {path: 'employees', component: EmployeesComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
