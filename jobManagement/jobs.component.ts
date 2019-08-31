import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {FirebaseService} from '../services/firebase.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Job } from '../models/job';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
    modalRef: BsModalRef;
    jobdetails: FormGroup;
    maxDate = new Date();
    jobsarr : any[];
    returnedArr: Job[];
    public showconfirmmessage: boolean = false;      
    private subscription: Subscription;
    private timer: Observable<any>;
    
    prefixes = [
        {value: 'Mr.', viewValue: 'Mr.'},
        {value: 'Mrs.', viewValue: 'Mrs.'},
        {value: 'Miss', viewValue: 'Miss'}
      ];

    
    constructor(private modalService: BsModalService, 
        private fb: FormBuilder,public firebaseService: FirebaseService, public excelService: ExcelService) {
            this.firebaseService.getJobs().subscribe( jobs => {
                this.jobsarr = jobs;
                this.returnedArr = this.jobsarr.slice(0,10);
                console.log(this.jobsarr);
            });
         }

  ngOnInit() {
    this.firebaseService.getJobs().subscribe( jobs => {
        this.jobsarr = jobs;
        this.returnedArr = this.jobsarr.slice(0,10);
    });
  }


   public ngOnDestroy() {
     if ( this.subscription && this.subscription instanceof Subscription) {
       this.subscription.unsubscribe();
     }
   }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.jobdetails= this.fb.group({ 
        contactmaster : new FormGroup({  
            email : new FormControl('', [Validators.required, Validators.email]),
            clientname : new FormControl('', [Validators.required]) ,
            clientcode : new FormControl('', [Validators.required]),
            contactname : new FormControl('', [Validators.required]),
            prefix : new FormControl('', [Validators.required]),
            contactno : new FormControl('', [Validators.required]),
            contactdate: new FormControl('',[Validators.required]),
            primaryindus: new FormControl('', [Validators.required]),
            designation: new FormControl('',[Validators.required]),
            primarysubindus: new FormControl('',[Validators.required]),
            serviceline: new FormControl('',[Validators.required]),
            comments: new FormControl('')
        }),
        referralsource : new FormGroup({
            refname : new FormControl('',[Validators.required]),
            officeloc: new FormControl('',[Validators.required]),
            refemailid: new FormControl('',[Validators.required]),
            otherleadsrc: new FormControl('',[Validators.required])
        }),
        clientdetails : new FormGroup({
            name : new FormControl('',[Validators.required]),
            group: new FormControl('',[Validators.required]),
            legalent: new FormControl('',[Validators.required]),
            website: new FormControl('',[Validators.required]),
            totalemp: new FormControl(''),
            totalrev : new FormControl('',[Validators.required]),
            assets : new FormControl(''),
            sharecap : new FormControl(''),
            revenue : new FormControl(''),
            networth : new FormControl(''),
            fee : new FormControl('',[Validators.required]),
            pipelinedesc : new FormControl('',[Validators.required]),
            exprecov : new FormControl('')
        }),
        address : new FormGroup({
            premises : new FormControl('',[Validators.required]),
            addtype : new FormControl('',[Validators.required]),
            area : new FormControl(''),
            road : new FormControl(''),
            state : new FormControl('',[Validators.required]),
            city : new FormControl('',[Validators.required]),
            zip : new FormControl('',[Validators.required]),
            country : new FormControl('',[Validators.required]),
        })
    });
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  /* Input Field Validations*/
  getErrorMessage(field:any) {
      if(field == 'email'){
        return this.jobdetails.get('contactmaster').get('email').hasError('required') ? 'You must enter a value' :
        this.jobdetails.get('contactmaster').get('email').hasError('email') ? 'Not a valid email' :'';
      }else if(field == 'clientname'){
        return this.jobdetails.get('contactmaster').get('clientname').hasError('required') ? 'You must enter a value':'';
      }else if(field == 'clientcode'){
        return this.jobdetails.get('contactmaster').get('clientcode').hasError('required') ? 'You must enter a value':'';
      }else if(field == 'contactname'){
        return this.jobdetails.get('contactmaster').get('contactname').hasError('required') ? 'You must enter a value':'';
      }else if(field == 'prefix'){
        return this.jobdetails.get('contactmaster').get('prefix').hasError('required') ? 'You must enter a value':'';
      }else if(field == 'contactno'){
        return this.jobdetails.get('contactmaster').get('contactno').hasError('required') ? 'You must enter a value':'';
      }else if(field == 'primaryindus'){
        return this.jobdetails.get('contactmaster').get('primaryindus').hasError('required') ? 'You must enter a value':'';
      }else if(field == 'contactdate'){
        return this.jobdetails.get('contactmaster').get('contactdate').hasError('required') ? 'You must enter a value':'';
      }
  }

  onSubmit(value){
        this.modalRef.hide();
	    this.firebaseService.createJob(value)
	    .then(
	    res => {
        this.setTimer();
	})
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

  updateJobStatus(job){
    job.status = 'Inactive';
    this.firebaseService.updateJob(job);
  }

  //pagination
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArr = this.jobsarr.slice(startItem, endItem);
  }

  exportAsXLSX():void {
    var printarr = [];
    for(var i=0;i<this.jobsarr.length;i++){
      printarr[i] = this.jobsarr[i].contactmaster.concat(this.jobsarr[i].referralsource.
      concat(this.jobsarr[i].clientdetails.concat(this.jobsarr[i].address)));
    }
    this.excelService.exportAsExcelFile(this.jobsarr, 'Jobs');
 }
}