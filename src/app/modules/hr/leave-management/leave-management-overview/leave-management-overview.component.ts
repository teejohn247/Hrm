import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveRequestTable } from 'src/app/shared/models/leave-requests';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { LeaveReviewComponent } from 'src/app/shared/components/leave-review/leave-review.component';

@Component({
  selector: 'app-leave-management-overview',
  templateUrl: './leave-management-overview.component.html',
  styleUrls: ['./leave-management-overview.component.scss']
})
export class LeaveManagementOverviewComponent implements OnInit {

  displayedColumns: any[];
  requestedApprovals: any[] = [];
  approvedRequests: any[] = [];
  leaveTypeList: any[] = [];
  dataSource: MatTableDataSource<LeaveRequestTable>;
  selection = new SelectionModel<LeaveRequestTable>(true, []);

  requestMatrix = [
    {
      id: 1,
      label: "21+",
      staff: [
        {
          image: "staff1.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "profile-img.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "staff1.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
      ]
    },
    {
      id: 2,
      label: "15-21",
      staff: [
        {
          image: "staff1.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "profile-img.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "profile-img.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
      ]
    },
    {
      id: 3,
      label: "8-14",
      staff: [
        {
          image: "staff2.jpg"
        },
        {
          image: "profile-img.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "staff1.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
      ]
    },
    {
      id: 4,
      label: "0-7",
      staff: [
        {
          image: "staff1.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "profile-img.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
        {
          image: "profile-img.jpg"
        },
        {
          image: "staff3.jpg"
        },
        {
          image: "staff2.jpg"
        },
      ]
    },
  ]

  //Leave Request Table Column Names
  tableColumns: TableColumn[] = [
    {
      key: "select",
      label: "Select",
      order: 1,
      columnWidth: "2%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "image",
      label: "Image",
      order: 2,
      columnWidth: "6%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "fullName",
      label: "Name",
      order: 3,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveTypeName",
      label: "Leave Type",
      order: 2,
      columnWidth: "10%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "requestDate",
      label: "Date Submitted",
      order: 8,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveStartDate",
      label: "Start Date",
      order: 4,
      columnWidth: "12%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "leaveEndDate",
      label: "End Date",
      order: 5,
      columnWidth: "13%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "approver",
    //   label: "Approver",
    //   order: 6,
    //   columnWidth: "12%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "status",
      label: "Status",
      order: 9,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    },
    // {
    //   key: "dateOfBirth",
    //   label: "Date of Birth",
    //   order: 8,
    //   columnWidth: "8%",
    //   cellStyle: "width: 100%",
    //   sortable: true
    // },
    {
      key: "actions",
      label: "Actions",
      order: 10,
      columnWidth: "8%",
      cellStyle: "width: 100%",
      sortable: true
    }

  ]

  tableData: LeaveRequestTable[] = []

  constructor(
    private hrService: HumanResourcesService,
    private notifyService: NotificationService,     
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) {
    this.getPageData();
  }

  ngOnInit(): void {
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
    this.dataSource = new MatTableDataSource(this.tableData);
  }

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

  getPageData = async () => {
    this.requestedApprovals = await this.hrService.getRequestedLeaveApprovals().toPromise();
    this.leaveTypeList = await this.hrService.getLeaveTypes().toPromise();
    // console.log(this.leaveTypeList);
    this.dataSource = new MatTableDataSource(this.requestedApprovals['data']);
    console.log(this.requestedApprovals);
    this.approvedRequests = this.requestedApprovals['data'].filter(item => {
      return item.status === 'Approved';
    })    
    console.log(this.approvedRequests);
  }

  strToDate(dateVal: string, key:string) {
    if(key == 'requestDate') {
      let newFormat = new Date(dateVal);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }
    else if(key = 'summary') {
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'MMM d')
    }
    else {
      const [day, month, year] = dateVal.split('-');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }    
  }

  actionRequest(details: any) {
    this.dialog.open(LeaveReviewComponent, {
      width: '30%',
      height: 'auto',
      data: {
        id: details._id,
        isExisting: true,
        modalInfo: details,
        leaveTypes: this.leaveTypeList['data'], 
        forApproval: true
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

}
