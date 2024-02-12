import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-department-info',
  templateUrl: './department-info.component.html',
  styleUrls: ['./department-info.component.scss']
})
export class DepartmentInfoComponent implements OnInit {

  departmentFieldData: FormFields[];
  departmentForm!: FormGroup;
  employees: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DepartmentInfoComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.employees = this.data.staff;

    console.log(data);
    this.departmentForm = this.fb.group({});

    this.departmentFieldData = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.departmentName : this.data.name,
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'manager',
        controlType: 'select',
        controlLabel: 'Manager',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.managerId : null,
        selectOptions: this.arrayToObject(this.employees, 'fullName'),
        validators: null,
        order: 7
      },
      // {
      //   controlName: 'description',
      //   controlType: 'textarea',
      //   controlLabel: 'Description',
      //   controlWidth: '100%',
      //   initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
      //   validators: null,
      //   order: 2
      // }
    ]

    this.departmentFieldData.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.departmentForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.departmentForm.valid) {
      let data = {
        departmentName: this.departmentForm.value.name,
        managerId: this.departmentForm.value.manager
      }
      console.log(this.data);
      if(this.data.modalInfo?.departmentName) {
        this.hrService.updateDepartment(data, this.data.id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              if(this.data.isExisting) this.notifyService.showSuccess('This department has been updated successfully');
              else this.notifyService.showSuccess('This department has been created successfully');
              this.dialogRef.close();
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
      else {
        this.hrService.createDepartment(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This department has been created successfully');
              this.dialogRef.close();
            }
            //this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    }
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      agg[item['_id']] = item[key];
      return agg;
    }, {})
    console.log(reqObj);
    return reqObj;
  }

}
