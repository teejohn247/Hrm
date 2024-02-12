import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormFields } from 'src/app/shared/models/form-fields';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.scss']
})
export class LeaveReviewComponent implements OnInit {

  leaveRequestFields: FormFields[];
  leaveForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<LeaveReviewComponent>,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder

  ) {
    this.leaveForm = this.fb.group({})
    console.log(this.data);

    this.leaveRequestFields = [
      {
        controlName: 'leaveType',
        controlType: 'select',
        controlLabel: 'Leave Type',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo.leaveTypeId,
        selectOptions: this.arrayToObject(this.data.leaveTypes, 'leaveName'),
        validators: [Validators.required],
        order: 1
      },
      {
        controlName: 'startDate',
        controlType: 'date',
        controlLabel: 'Start Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.convertToDate(this.data.modalInfo.leaveStartDate),
        validators: [Validators.required],
        order: 2
      },
      {
        controlName: 'endDate',
        controlType: 'date',
        controlLabel: 'End Date',
        controlWidth: '48%',
        readonly: this.data.forApproval,
        initialValue: this.convertToDate(this.data.modalInfo.leaveEndDate),
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'message',
        controlType: 'textarea',
        controlLabel: 'Message',
        controlWidth: '100%',
        readonly: this.data.forApproval,
        initialValue: this.data.modalInfo.requestMessage,
        validators: [Validators.required],
        order: 4
      },
    ]

    if(this.data.forApproval) {
      this.leaveRequestFields.push({
        controlName: 'decisionReason',
        controlType: 'textarea',
        controlLabel: 'Reason for decision',
        controlWidth: '100%',
        readonly: false,
        initialValue: '',
        validators: null,
        order: 6
      })
    }

    this.leaveRequestFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.leaveForm.addControl(field.controlName, formControl)
    })
  }

  ngOnInit(): void {
  }

  //Converts an array to an Object of key value pairs
  arrayToObject(arrayVar, key:string) {
    let reqObj = {}
    reqObj = arrayVar.reduce((agg, item, index) => {
      if(this.data.forApproval) {
        agg[item['_id']] = item[key];
      }
      else {
        agg[item['leaveTypeId']] = item[key];
      }
      
      return agg;
    }, {})
    return reqObj;
  }

  // Convert dd/mm/yyyy to date object
  convertToDate(dateString: any) {
    let d = dateString.split("-");
    let newFormat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return newFormat;     
  }

  onSubmit(action: string) {
    if(this.leaveForm.valid) {
      let data = {
        leaveId: this.data.id,
        approved: action == 'approve' ? true : false,
        // description: this.leaveForm.value.decisionReason
      }
      console.log(this.data);
      this.hrService.actionLeaveRequest(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            if(data.approved) this.notifyService.showSuccess('This leave request has been approved');
            else this.notifyService.showInfo('This leave request has been declined');
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

  updateLeaveRequest() {
    if(this.leaveForm.valid) {
      let data = {
        leaveTypeId: this.leaveForm.value.leaveType,
        leaveStartDate: this.datePipe.transform(this.leaveForm.value.startDate, 'dd-MM-yyyy'),
        leaveEndDate: this.datePipe.transform(this.leaveForm.value.endDate, 'dd-MM-yyyy'),
        requestMessage: this.leaveForm.value.message
      }
      console.log(data);
      this.hrService.updateLeaveRequest(data, this.data.id).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.notifyService.showSuccess('Your leave application has been updated successfully');
            this.dialogRef.close();
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
  }

}
