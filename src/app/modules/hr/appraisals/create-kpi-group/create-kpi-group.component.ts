import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';


@Component({
  selector: 'app-create-kpi-group',
  templateUrl: './create-kpi-group.component.html',
  styleUrls: ['./create-kpi-group.component.scss']
})
export class CreateKpiGroupComponent implements OnInit {

  kpiGroupFields: FormFields[];
  kpiGroupForm!: FormGroup;
  departmentList: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateKpiGroupComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.departmentList = this.data.departments;
    console.log(this.departmentList);
    this.kpiGroupForm = this.fb.group({})

    this.kpiGroupFields = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.groupName : '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'departmentIds',
        controlType: 'mutipleSelect',
        controlLabel: 'Departments',
        controlWidth: '100%',
        initialValue: '',
        selectOptions: this.arrayToObject(this.departmentList, 'departmentName'),
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.description : null,
        validators: null,
        order: 3
      }
    ]

    this.kpiGroupFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.kpiGroupForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.kpiGroupForm.valid) {
      let data = {
        name: this.kpiGroupForm.value.name,
        description: this.kpiGroupForm.value.description,
        departments: this.kpiGroupForm.value.departmentIds
      }
      console.log(this.data);
      if(this.data.isExisting) {
        this.hrService.updateKpiGroup(data, this.data.modalInfo._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This KPI group has been updated successfully');
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
        this.hrService.createKpiGroup(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This KPI group has been created successfully');
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

  removeDept(deptName: string) {
    const selectedDepts = this.kpiGroupForm.value['departmentIds'] as string[];
    this.removeFirst(selectedDepts, deptName);
    this.kpiGroupForm.get['departmentIds'].setValue(selectedDepts); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
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

  showDept(deptId) {
    console.log(deptId);
    return this.kpiGroupFields[1].selectOptions[deptId];
  }

}
