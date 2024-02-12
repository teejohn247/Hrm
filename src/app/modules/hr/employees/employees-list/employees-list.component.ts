import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeeData, EmployeeTable } from 'src/app/shared/models/employee-data';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { CreateSingleInfoComponent } from 'src/app/shared/components/create-single-info/create-single-info.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { AssignManagerApproversComponent } from '../assign-manager-approvers/assign-manager-approvers.component';


@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeesListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any[];
  dataSource: MatTableDataSource<EmployeeData>;
  selection = new SelectionModel<EmployeeData>(true, []);

  employeeList: any[] = [];
  departmentList: any[] = [];
  designationList: any[] = [];

  //Employee Table Column Names
  tableColumns: EmployeeTable[] = [
    {
      key: "select",
      label: "Select",
      order: 1,
      columnWidth: "3%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "image",
      label: "Image",
      order: 2,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "name",
      label: "Name",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "email",
      label: "Email Address",
      order: 6,
      columnWidth: "14%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "phoneNumber",
    //   label: "Phone Number",
    //   order: 7,
    //   columnWidth: "12%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    // {
    //   key: "dateOfBirth",
    //   label: "Date of Birth",
    //   order: 8,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "department",
      label: "Department",
      order: 8,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "companyRole",
      label: "Role",
      order: 9,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "activeStatus",
      label: "Status",
      order: 10,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "actions",
      label: "Actions",
      order: 11,
      columnWidth: "5%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  employeeData : any = [
    // {
    //   id: 1,
    //   "Employee ID": "EMP-2021-MB45",
    //   "Image": "staff1.jpg",
    //   "First Name": "Mellie",
    //   "Last Name": "Gabbott",
    //   "Email Address": "mellie.gabbott@silo.com",
    //   "Phone Number": "+234 845 2345 566",
    //   "Department": "Marketing",
    //   "Role": "Marketing Manager"
    // },
    // {
    //   id: 2,
    //   "Employee ID": "EMP-2021-YA65",
    //   "Image": "staff2.jpg",
    //   "First Name": "Yehudi",
    //   "Last Name": "Ainsby",
    //   "Email Address": "yehudi.ainsby@silo.com",
    //   "Phone Number": "+234 355 2445 586",
    //   "Department": "Technical",
    //   "Role": "Support Analyst"
    // },
    // {
    //   id: 3,
    //   "Employee ID": "EMP-2020-NP50",
    //   "Image": "profile-img.jpg",
    //   "First Name": "Noellyn",
    //   "Last Name": "Primett",
    //   "Email Address": "noellyn.primett@silo.com",
    //   "Phone Number": "+234 355 2445 586",
    //   "Department": "Sales",
    //   "Role": "Business Analyst"
    // },
    // {
    //   id: 4,
    //   "Employee ID": "EMP-2020-YS30",
    //   "Image": "staff3.jpg",
    //   "First Name": "Yurenin",
    //   "Last Name": "Stefanieg",
    //   "Email Address": "yurenin.staefanieg@silo.com",
    //   "Phone Number": "+234 355 2445 586",
    //   "Department": "Technical",
    //   "Role": "Senior Officer"
    // },
  ]

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) {
    this.getPageData();
  }

  ngOnInit(): void {
    console.log(this.employeeList);
    this.displayedColumns = this.tableColumns.map(column => column.label);
    console.log(this.employeeList);
  }

  // ngAfterViewInit() {
    
  // }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  addNewEmployee() {
    let dialogRef = this.dialog.open(CreateSingleInfoComponent, {
      width: '35%',
      height: 'auto',
      data: {
        departmentList: this.departmentList['data'],
        designationList: this.designationList['data'],
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    }); 
  }

  addBulkEmployees() {
    let dialogRef = this.dialog.open(BulkUploadComponent, {
      width: '35%',
      height: 'auto',
      data: {
        departmentList: this.departmentList['data'],
        designationList: this.designationList['data'],
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPageData();
    }); 
  }

  //Delete an employee
  deleteEmployee(info: any) {
    console.log(info);
    this.notifyService.confirmAction({
      title: 'Remove Employee',
      message: 'Are you sure you want to remove this employee?',
      confirmText: 'Remove Employee',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteEmployee(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('The employee has been deleted successfully');
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

  viewEmployee(info: any) {
    this.router.navigateByUrl(`dashboard/human-resources/employees/${info._id}`);
  }

  getPageData = async () => {
    this.employeeList = await this.hrService.getEmployees().toPromise();
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.designationList = await this.hrService.getDesignations().toPromise();

    console.log(this.employeeList);
    this.dataSource = new MatTableDataSource(this.employeeList['data']);
    this.dataSource.sort = this.sort;
  }

  assignManager(assignType: string, count: string, row?: any) {
    if(row) this.selection.select(row);
    console.log(this.selection.selected);
    let dialogRef = this.dialog.open(AssignManagerApproversComponent, {
      width: '25%',
      height: 'auto',
      data: {
        assignmentType: assignType,
        employeeList: this.employeeList['data'],
        selections: this.selection['selected'],
        isExisting: false
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.selection.clear()
      this.getPageData();
    }); 
  }



}
