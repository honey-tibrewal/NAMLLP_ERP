
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 
'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Job } from '../models/job';
import { map } from 'rxjs/operators';
import{ Employee } from '../models/Employee';

@Injectable()
export class FirebaseService {
  jobscollection : AngularFirestoreCollection<Job>;
  jobdoc: AngularFirestoreDocument;
  jobs: Observable<Job[]>;
  employees: Observable<Employee[]>;
  employeedoc: AngularFirestoreDocument;

  constructor(public db: AngularFirestore) {
    this.jobs = this.db.collection('jobs', ref => ref.orderBy('contactmaster.contactdate','asc')).snapshotChanges().pipe(map(changes => {
      return changes.map( a => {
        const data = a.payload.doc.data() as Job;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }


  //userlogin

  trylogin(value:any){
    
  }
//JOBS

  createJob(value : any){
        return this.db.collection('jobs').add({
            jobcode : value.contactmaster.clientcode,
            status : 'Active',
            contactmaster : value.contactmaster,
            referralsource : value.referralsource,
            clientdetails : value.clientdetails,
            address : value.address
        });
    }

    getJobs(){
      this.jobs = this.db.collection('jobs', ref => ref.orderBy('contactmaster.contactdate','asc')).snapshotChanges().pipe(map(changes => {
        return changes.map( a => {
          const data = a.payload.doc.data() as Job;
          data.id = a.payload.doc.id;
          return data;
        })
      }));
      return this.jobs;
    }

    deleteJob(job: any){
      this.jobdoc = this.db.collection('jobs').doc(job.id);
      this.jobdoc.delete();
    }

    updateJob(job : any){
      this.jobdoc = this.db.collection('jobs').doc(job.id);
      this.jobdoc.update(job);
    }

//EMPLOYEES
    getEmployees(){
      this.employees = this.db.collection('employees').snapshotChanges().pipe(map(changes => {
        return changes.map( a => {
          const data = a.payload.doc.data() as Employee;
          data.id = a.payload.doc.id;
          return data;
        })
      }));
      return this.employees;
    }

    addEmployee(value: any){
      return this.db.collection('employees').add({
        name : value.empname,
        email: value.email,
        contactno : value.contactno,
        joiningdate : value.joiningdate,
        leavesaccrued : value.leavesaccrued,
        leavetaken : '0',
        status : value.status,
        designation : value.designation,
        password: value.password,
        userName: value.userName
      });
    }

    updateEmployee(employee: any){
      this.employeedoc = this.db.collection('employees').doc(employee.id);
      this.employeedoc.update(employee);
    }

    updateEmp(employee:any){
      this.employeedoc = this.db.collection('employees').doc(employee.id);
      employee.name = employee.empname;
      delete employee.empname;
      this.employeedoc.update(employee);
    }
}