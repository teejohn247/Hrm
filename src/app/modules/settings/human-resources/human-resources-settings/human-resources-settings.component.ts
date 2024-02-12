import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { DesignationInfoComponent } from '../designation-info/designation-info.component';
import { LeaveTypeInfoComponent } from '../leave-type-info/leave-type-info.component';
import { DepartmentInfoComponent } from '../department-info/department-info.component';
import { PayrollCreditInfoComponent } from '../payroll-credit-info/payroll-credit-info.component';
import { PayrollDebitInfoComponent } from '../payroll-debit-info/payroll-debit-info.component';
import { ExpenseTypeInfoComponent } from '../expense-type-info/expense-type-info.component';
import { PublicHolidayInfoComponent } from '../public-holiday-info/public-holiday-info.component';

@Component({
  selector: 'app-human-resources-settings',
  templateUrl: './human-resources-settings.component.html',
  styleUrls: ['./human-resources-settings.component.scss']
})
export class HumanResourcesSettingsComponent implements OnInit {

  panelOpenState = false;
  accordionItems: any[] = [];
  payrollAccordionItems: any[] = [];

  departmentList: any[] = [];
  companyRoles: any[] = [];
  designationList: any[] = [];
  leaveTypeList: any[] = [];
  publicHolidayList: any[] = [];
  expenseTypeList: any[] = [];
  payrollCreditList: any[] = [];
  payrollDebitList:any[] = [];
  employees: any[] = [];

  hrSettingsForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private fb: FormBuilder
  ) {
    this.hrSettingsForm = this.fb.group({
      department: [''],
      designation: [''],
      companyRole: [''],
      leaveType: [''],
      holidayName: [''],
      expenseType: [''],
      payrollCredit: [''],
      payrollDebit: ['']
    })
  }

  ngOnInit(): void {
    this.getPageData();
  }

  getPageData = async () => {
    this.payrollCreditList = await this.hrService.getPayrollCredits().toPromise();
    this.payrollDebitList = await this.hrService.getPayrollDebits().toPromise();

    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.employees = await this.hrService.getEmployees().toPromise();
    this.designationList = await this.hrService.getDesignations().toPromise();
    this.leaveTypeList = await this.hrService.getLeaveTypes().toPromise();
    this.publicHolidayList = await this.hrService.getPublicHolidays().toPromise();
    this.expenseTypeList = await this.hrService.getExpenseTypes().toPromise();
    this.accordionItems = [
      {
        label: "Departments",
        key: "departments",
        list: this.departmentList['data']
      },
      {
        label: "Designations",
        key: "designations",
        list: this.designationList['data']
      },
      // {
      //   label: "Company Roles",
      //   key: "companyRoles",
      //   list: this.companyRoles['data']
      // },
      {
        label: "Leave Types",
        key: "leaveTypes",
        list: this.leaveTypeList['data']
      },
      {
        label: "Holidays",
        key: "holidayTypes",
        list: this.publicHolidayList['data']
      },
      {
        label: "Expense Types",
        key: "expenseTypes",
        list: this.expenseTypeList['data']
      },
    ]

    this.payrollAccordionItems = [
      {
        label: "Payroll Credits",
        key: "payrollCredits",
        list: this.payrollCreditList['data']
      },
      {
        label: "Payroll Debits",
        key: "payrollDebits",
        list: this.payrollDebitList['data']
      }
    ]

    console.log(this.expenseTypeList);
  }

  /*************** DEPARTMENT RELATED ACTIONS ***************/
  
  //Create a new department
  createDepartment() {
    let data = {
      departmentName: this.hrSettingsForm.value.department ? this.hrSettingsForm.value.department : ""
    }
    if(this.hrSettingsForm.value.department) {
      this.hrService.createDepartment(data).subscribe({
        next: res => {
          // console.log(res);
          if(res.status == 200) {
            this.dialog.open(DepartmentInfoComponent, {
              width: '30%',
              height: 'auto',
              data: {
                name: data.departmentName,
                id: res.data._id,
                isExisting: false,
                staff: this.employees['data']
              },
            }).afterClosed().subscribe(() => {
              this.hrSettingsForm.reset();
              this.getPageData();
            });
            // this.notifyService.showSuccess('This designation has been created successfully');
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.dialog.open(DepartmentInfoComponent, {
        width: '30%',
        height: 'auto',
        data: {
          name: data.departmentName,
          isExisting: false,
          staff: this.employees['data']
        },
      }).afterClosed().subscribe(() => {
        this.getPageData();
      });
    }
  }

  //Edit a department
  editDepartment(details: any) {
    this.dialog.open(DepartmentInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.departmentName,
        id: details._id,
        isExisting: true,
        modalInfo: details,
        staff: this.employees['data']
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a department
  deleteDept(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.departmentName + ' Department',
      message: 'Are you sure you want to remove this department?',
      confirmText: 'Remove Department',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteDepartment(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The department has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** DESIGNATION RELATED ACTIONS ***************/

  //Create a new designation
  createDesignation() {
    let data = {
      "designationName": this.hrSettingsForm.value.designation ? this.hrSettingsForm.value.designation : ""
    }
    if(this.hrSettingsForm.value.designation) {
      this.hrService.createDesignation(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.dialog.open(DesignationInfoComponent, {
              width: '32%',
              height: 'auto',
              data: {
                name: data.designationName,
                id: res.data._id,
                leaveTypes: this.leaveTypeList['data'],
                isExisting: false
              },
            }).afterClosed().subscribe(() => {
              this.hrSettingsForm.reset();
              this.getPageData();
            });
            // this.notifyService.showSuccess('This designation has been created successfully');
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.dialog.open(DesignationInfoComponent, {
        width: '32%',
        height: 'auto',
        data: {
          name: data.designationName,
          leaveTypes: this.leaveTypeList['data'],
          isExisting: false
        },
      }).afterClosed().subscribe(() => {
        this.getPageData();
      });
    }
    
    // console.log(data);
    // this.hrService.createDesignation(data).subscribe(res => {
    //   if(res.status == 200) {
    //     location.reload();
    //   }
    // })
  }

  //Edit a designation
  editDesignation(details: any) {
    this.dialog.open(DesignationInfoComponent, {
      width: '32%',
      height: 'auto',
      data: {
        name: details.designationName,
        id: details._id,
        leaveTypes: this.leaveTypeList['data'],
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });;
  }

  //Delete a designation
  deleteDesignation(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.designationName + ' Designation',
      message: 'Are you sure you want to remove this designation?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteDesignation(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The designation has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** LEAVE TYPES RELATED ACTIONS ***************/

  //Create a new leave type
  createLeaveType() {
    let data = {
      leaveName: this.hrSettingsForm.value.leaveType ? this.hrSettingsForm.value.leaveType : ""
    }
    if(this.hrSettingsForm.value.leaveType) {
      this.hrService.createLeaveType(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.getPageData();
            // this.notifyService.showSuccess('This leave type has been created successfully');
            this.dialog.open(LeaveTypeInfoComponent, {
              width: '30%',
              height: 'auto',
              data: {
                name: data.leaveName,
                isExisting: false
              },
            }).afterClosed().subscribe(() => {
              this.getPageData();
            });
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.dialog.open(LeaveTypeInfoComponent, {
        width: '30%',
        height: 'auto',
        data: {
          name: data.leaveName,
          isExisting: false
        },
      }).afterClosed().subscribe(() => {
        this.getPageData();
      });
    }
    
    // console.log(data);
    // this.hrService.createDesignation(data).subscribe(res => {
    //   if(res.status == 200) {
    //     location.reload();
    //   }
    // })
  }

  //Edit a leave type
  editLeaveType(details: any) {
    this.dialog.open(LeaveTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.leaveName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });;
  }

  //Delete a leave type
  deleteLeaveType(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.leaveName + ' Leave Type',
      message: 'Are you sure you want to remove this leave type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteLeaveType(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The leave type has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PUBLIC HOLIDAYS RELATED ACTIONS ***************/

  //Create a new public holiday
  createPublicHoliday() {
    let data = {
      holidayName: this.hrSettingsForm.value.holidayName ? this.hrSettingsForm.value.holidayName : ""
    }
    if(this.hrSettingsForm.value.holidayName) {
      this.hrService.createPublicHoliday(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.getPageData();
            // this.notifyService.showSuccess('This leave type has been created successfully');
            this.dialog.open(PublicHolidayInfoComponent, {
              width: '30%',
              height: 'auto',
              data: {
                name: data.holidayName,
                isExisting: false
              },
            }).afterClosed().subscribe(() => {
              this.getPageData();
            });
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.dialog.open(PublicHolidayInfoComponent, {
        width: '30%',
        height: 'auto',
        data: {
          name: data.holidayName,
          isExisting: false
        },
      }).afterClosed().subscribe(() => {
        this.getPageData();
      });
    }
    
    // console.log(data);
    // this.hrService.createDesignation(data).subscribe(res => {
    //   if(res.status == 200) {
    //     location.reload();
    //   }
    // })
  }

  //Edit a public holiday
  editPublicHoliday(details: any) {
    this.dialog.open(PublicHolidayInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.holidayName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });;
  }

  //Delete a public holiday
  deletePublicHoliday(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.holidayName + ' Holiday',
      message: 'Are you sure you want to remove this public holiday?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePublicHoliday(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The public holiday has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** EXPENSE TYPES RELATED ACTIONS ***************/

  //Create a new expense type
  createExpenseType() {
    let data = {
      expenseName: this.hrSettingsForm.value.expenseType ? this.hrSettingsForm.value.expenseType : ""
    }
    if(this.hrSettingsForm.value.expenseType) {
      this.hrService.createExpenseType(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.getPageData();
            // this.notifyService.showSuccess('This leave type has been created successfully');
            this.dialog.open(ExpenseTypeInfoComponent, {
              width: '30%',
              height: 'auto',
              data: {
                name: data.expenseName,
                isExisting: false
              },
            }).afterClosed().subscribe(() => {
              this.getPageData();
            });
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.dialog.open(ExpenseTypeInfoComponent, {
        width: '30%',
        height: 'auto',
        data: {
          name: data.expenseName,
          isExisting: false
        },
      }).afterClosed().subscribe(() => {
        this.getPageData();
      });
    }
    
    // console.log(data);
    // this.hrService.createDesignation(data).subscribe(res => {
    //   if(res.status == 200) {
    //     location.reload();
    //   }
    // })
  }

  //Edit an expense type
  editExpenseType(details: any) {
    this.dialog.open(ExpenseTypeInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.expenseName,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });;
  }

  //Delete an expense type
  deleteExpenseType(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.expenseType + ' Expense Type',
      message: 'Are you sure you want to remove this expense type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteExpenseType(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The expense type has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PAYROLL CREDIT TYPES RELATED ACTIONS ***************/

  //Create a new payroll credit type
  createPayrollCredit() {
    let data = {
      name: this.hrSettingsForm.value.payrollCredit ? this.hrSettingsForm.value.payrollCredit : ""
    }
    if(this.hrSettingsForm.value.leaveType) {
      this.hrService.createPayrollCredit(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.getPageData();
            // this.notifyService.showSuccess('This leave type has been created successfully');
            this.dialog.open(PayrollCreditInfoComponent, {
              width: '30%',
              height: 'auto',
              data: {
                name: data.name,
                isExisting: false
              },
            }).afterClosed().subscribe(() => {
              this.getPageData();
            });
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.dialog.open(PayrollCreditInfoComponent, {
        width: '30%',
        height: 'auto',
        data: {
          name: data.name,
          isExisting: false
        },
      }).afterClosed().subscribe(() => {
        this.getPageData();
      });
    }
    
    // console.log(data);
    // this.hrService.createDesignation(data).subscribe(res => {
    //   if(res.status == 200) {
    //     location.reload();
    //   }
    // })
  }

  //Edit a payroll credit type
  editPayrollCredit(details: any) {
    this.dialog.open(PayrollCreditInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.name,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a payroll credit type
  deletePayrollCredit(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.name,
      message: 'Are you sure you want to remove this payroll credit type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollCredit(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The payroll credit type has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }

  /*************** PAYROLL DEBIT TYPES RELATED ACTIONS ***************/

  //Create a new payroll debit type
  createPayrollDebit() {
    let data = {
      name: this.hrSettingsForm.value.payrollDebit ? this.hrSettingsForm.value.payrollDebit : ""
    }
    if(this.hrSettingsForm.value.leaveType) {
      this.hrService.createPayrollDebit(data).subscribe({
        next: res => {
          console.log(res);
          if(res.status == 200) {
            this.getPageData();
            // this.notifyService.showSuccess('This leave type has been created successfully');
            this.dialog.open(PayrollDebitInfoComponent, {
              width: '30%',
              height: 'auto',
              data: {
                name: data.name,
                isExisting: false
              },
            }).afterClosed().subscribe(() => {
              this.getPageData();
            });
          }
        },
        error: err => {
          console.log(err)
          this.notifyService.showError(err.error.error);
        } 
      })
    }
    else {
      this.dialog.open(PayrollDebitInfoComponent, {
        width: '30%',
        height: 'auto',
        data: {
          name: data.name,
          isExisting: false
        },
      }).afterClosed().subscribe(() => {
        this.getPageData();
      });
    }
    
    // console.log(data);
    // this.hrService.createDesignation(data).subscribe(res => {
    //   if(res.status == 200) {
    //     location.reload();
    //   }
    // })
  }

  //Edit a payroll debit type
  editPayrollDebit(details: any) {
    this.dialog.open(PayrollDebitInfoComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: details.name,
        id: details._id,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });;
  }

  //Delete a payroll debit type
  deletePayrollDebit(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.name,
      message: 'Are you sure you want to remove this payroll debit type?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deletePayrollDebit(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This payroll debit type has been deleted successfully');
            }
            this.getPageData();
          },
          error: err => {
            console.log(err)
            this.notifyService.showError(err.error.error);
          } 
        })
      }
    });
  }
}
