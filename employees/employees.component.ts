import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Employee} from '../models/Employee';
import{ FirebaseService} from '../services/firebase.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

    modalRef: BsModalRef;
    employeedetails: FormGroup;
    employeessarr : any[];
    returnedArr: Employee[];
    public showconfirmmessage: boolean = false;  
    private subscription: Subscription;
    private timer: Observable<any>;
    maxDate = new Date();
    modalName = "create";

    statuses = [
        {value: 'Active', viewValue: 'Active'},
        {value: 'Terminated', viewValue: 'Terminate'}
      ];


    constructor(private modalService: BsModalService, 
        private fb: FormBuilder,public firebaseService: FirebaseService, public excelService: ExcelService) {}

    ngOnInit() {
        this.firebaseService.getEmployees().subscribe( employees => {
                this.employeessarr = employees;
                this.returnedArr = this.employeessarr.slice(0,10);
        });
    }

    public ngOnDestroy() {
        if ( this.subscription && this.subscription instanceof Subscription) {
          this.subscription.unsubscribe();
        }
    }

    initializeFormGroupNew(){
        this.employeedetails= this.fb.group({ 
            empname : new FormControl('', [Validators.required]) , 
            joiningdate : new FormControl('', [Validators.required]),
            contactno : new FormControl('', [Validators.required]), 
            email : new FormControl('', [Validators.required, Validators.email]),
            leavesaccrued : new FormControl('', [Validators.required]),
            designation : new FormControl('',[Validators.required]),
            leavetaken : new FormControl('', [Validators.required]),
            status : new FormControl('',[Validators.required]),
            userName : new FormControl('',[Validators.required]),
            password: new FormControl('',[Validators.required])
        });
    }

    initializeFormGroupEdit(emp){
        this.employeedetails= this.fb.group({ 
            empname : new FormControl(emp.name, [Validators.required]) , 
            joiningdate : new FormControl(emp.joiningdate.toDate(), [Validators.required]),
            contactno : new FormControl(emp.contactno, [Validators.required]), 
            email : new FormControl(emp.email, [Validators.required, Validators.email]),
            leavesaccrued : new FormControl(emp.leavesaccrued, [Validators.required]),
            designation : new FormControl(emp.designation,[Validators.required]),
            leavetaken : new FormControl(emp.leavetaken, [Validators.required]),
            id: emp.id,
            status: new FormControl(emp.status,[Validators.required]),
            userName : new FormControl(emp.userName,[Validators.required]),
            password: new FormControl(emp.password,[Validators.required]) 
        });
    }

    getErrorMessage(field:any) {
        if(field == 'email'){
            return this.employeedetails.get('email').hasError('required') ? 'You must enter a value' :
            this.employeedetails.get('email').hasError('email') ? 'Not a valid email' :'';
        }else if(field == 'empname'){
            return this.employeedetails.get('empname').hasError('required') ? 'You must enter a value':'';
        }else if(field == 'joiningdate'){
            return this.employeedetails.get('joiningdate').hasError('required') ? 'You must enter a value':'';
        }else if(field == 'contactno'){
            return this.employeedetails.get('contactno').hasError('required') ? 'You must enter a value':'';
        }else if(field == 'leavesaccrued'){
            return this.employeedetails.get('leavesaccrued').hasError('required') ? 'You must enter a value':'';
        }else if(field == 'designation'){
            return this.employeedetails.get('designation').hasError('required') ? 'You must enter a value':'';
        }
    }

    openModalWithClass(template: TemplateRef<any>, modalname: string, employee: any) {
        if(modalname == "create"){
            this.modalName = "create";
            this.initializeFormGroupNew();
        }else if(modalname == "edit"){
            this.modalName = "edit";
            this.initializeFormGroupEdit(employee);
        }else if(modalname == "view"){
            this.modalName = "view";
            this.initializeFormGroupEdit(employee)
        }
       
        this.modalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'gray modal-lg' })
        );
    }

    onSubmit(value){
        if(this.modalName == "create"){
            this.modalRef.hide();
	        this.firebaseService.addEmployee(value)
	        .then(
	        res => {
            this.setTimer();
            })
        }else{
            this.modalRef.hide();
            this.updateEmployee(value);
            this.setTimer();
        }
    }

    public setTimer(){

        // set showconfirmdiv to true to show loading div on view
        this.showconfirmmessage   = true;
    
        this.timer        = Observable.timer(5000); // 5000 millisecond means 5 seconds
        this.subscription = this.timer.subscribe(() => {
            // set showconfirmdiv to false to hide loading div from view after 5 seconds
            this.showconfirmmessage = false;
        });
    }

    updateEmployeeStatus(employee){
        employee.status = 'Terminated';
        this.firebaseService.updateEmployee(employee);
      }
    
      //pagination
      pageChanged(event: PageChangedEvent): void {
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.returnedArr = this.employeessarr.slice(startItem, endItem);
      }

      exportAsXLSX():void {
        this.excelService.exportAsExcelFile(this.employeessarr, 'Employees');
     }

     updateEmployee(employee){
         this.firebaseService.updateEmp(employee);
     }

}