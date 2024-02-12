import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-create-kpi',
  templateUrl: './create-kpi.component.html',
  styleUrls: ['./create-kpi.component.scss']
})
export class CreateKpiComponent implements OnInit {

  kpiFields: FormFields[];
  kpiForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateKpiComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.kpiForm = this.fb.group({})

    this.kpiFields = [
      {
        controlName: 'name',
        controlType: 'text',
        controlLabel: 'Name',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.kpiName : '',
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'description',
        controlType: 'textarea',
        controlLabel: 'Description',
        controlWidth: '100%',
        initialValue: this.data.isExisting ? this.data.modalInfo.kpiDescription : null,
        validators: null,
        order: 2
      }
    ]

    this.kpiFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.kpiForm.addControl(field.controlName, formControl)
    })

  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.kpiForm.valid) {
      let data = {
        name: this.kpiForm.value.name,
        description: this.kpiForm.value.description,
        group: this.data.groupId
      }
      console.log(this.data);
      if(this.data.isExisting) {
        this.hrService.updateKpi(data, this.data.modalInfo._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This KPI has been updated successfully');
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
        this.hrService.createKpi(data).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showSuccess('This KPI has been created successfully');
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
}
