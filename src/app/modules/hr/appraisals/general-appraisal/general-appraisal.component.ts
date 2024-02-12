import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { CreateKpiGroupComponent } from '../create-kpi-group/create-kpi-group.component';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { CreateKpiComponent } from '../create-kpi/create-kpi.component';
import { CreateAppraisalPeriodComponent } from '../create-appraisal-period/create-appraisal-period.component';
import { CreateRatingScaleComponent } from '../create-rating-scale/create-rating-scale.component';


@Component({
  selector: 'app-general-appraisal',
  templateUrl: './general-appraisal.component.html',
  styleUrls: ['./general-appraisal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralAppraisalComponent implements OnInit {

  departmentList: any[] = [];
  appraisalPeriods: any[] = [];
  kpiGroups: any[] = [];
  sideModalOpened: boolean = false;

  appraisalKpis: any[] = [];
  periodInView: any;
  currentPeriodId: string;
  appraisalPeriodName: string;

  employees: any[] = [];

  matrixItems = [
    {
      id: 1,
      label: "Star",
      order: 3,
      staff: [
        {
          image: "staff1.jpg"
        },
      ]
    },
    {
      id: 2,
      label: "High Potential",
      order: 2,
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
      ]
    },
    {
      id: 3,
      label: "Potential Gem",
      order: 1
    },
    {
      id: 4,
      label: "High Performer",
      order: 6,
      staff: [
        {
          image: "staff1.jpg"
        },
        {
          image: "profile-img.jpg"
        },
      ]
    },
    {
      id: 5,
      label: "Core Player",
      order: 5,
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
      ]
    },
    {
      id: 6,
      label: "Inconsistent Player",
      order: 4,
      staff: [
        {
          image: "profile-img.jpg"
        },
      ]
    },
    {
      id: 7,
      label: "Solid Performer",
      order: 9,
      staff: [
        {
          image: "profile-img.jpg"
        },
      ]
    },
    {
      id: 8,
      label: "Average Performer",
      order: 8,
      staff: [
        {
          image: "staff1.jpg"
        },
        {
          image: "staff3.jpg"
        },
      ]
    },
    {
      id: 9,
      label: "Risk",
      order: 7,
    }
  ]

  ratingAccordionItems = [
    {
      name: "Excellent",
      description: "Highest quality of delivery and professionalism",
      ratingValue: 5
    },
    {
      name: "Very Good",
      description: "Great quality of delivery and professionalism",
      ratingValue: 4
    },
    {
      name: "Good",
      description: "Good quality of delivery and professionalism",
      ratingValue: 3
    },
    {
      name: "Average",
      description: "Average quality of delivery and professionalism",
      ratingValue: 2
    },
    {
      name: "Poor",
      description: "Poor quality of delivery and professionalism",
      ratingValue: 1
    }
  ]

  constructor(    
    public dialog: MatDialog,
    private router: Router,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
  ) {
    this.appraisalKpis = [
      {
        groupName: 'General',
        groupKpis: [
          {
            kpiName: 'Company Values',
            kpiDescription: 'How well do you keep the values of the company?'
          }
        ]
      },
      {
        groupName: 'Development',
        groupKpis: [
          {
            kpiName: 'Excellence',
            kpiDescription: 'How well do you pay attention to details?'
          },
          {
            kpiName: 'Technical Knowledge',
            kpiDescription: 'How well do you know about technical functionalities?'
          }
        ]
      },
      {
        groupName: 'Sales',
        groupKpis: [
          {
            kpiName: 'Return on investment',
            kpiDescription: 'How effective was your sales reach?'
          },
          {
            kpiName: 'Customer Conversion',
            kpiDescription: 'How many customers are you able to reach out to?'
          }
        ]
      }
    ]
  }

  ngOnInit(): void {
    this.matrixItems.sort((a,b) => (a.order - b.order));
    this.getPageData();
  }

  getPageData = async () => {
    this.departmentList = await this.hrService.getDepartments().toPromise();
    this.employees = await this.hrService.getEmployees().toPromise();
    this.ratingAccordionItems = await this.hrService.getKpiRatings().toPromise();
    this.kpiGroups = await this.hrService.getKpiGroups().toPromise();
    this.appraisalPeriods = await this.hrService.getAppraisalPeriods().toPromise();
    console.log(this.kpiGroups);
    // this.periodInView = this.appraisalPeriods['data'][0];
    this.currentPeriodId = this.appraisalPeriods['data'][0]._id;
    this.periodInView = await this.hrService.getAppraisalDetails(this.currentPeriodId).toPromise();
    this.periodInView = this.periodInView['data'];
    console.log(this.periodInView);
  }

  convertToNum(val) {
    return Number(val);
  }

  viewAppraisalInfo(info: any) {
    this.router.navigateByUrl(`dashboard/human-resources/appraisals/${info}`);
  }

  /* KPI Group Functions */

  // Create a KPI Group
  addKpiGroup() {
    this.dialog.open(CreateKpiGroupComponent, {
      width: '30%',
      height: 'auto',
      data: {
        departments: this.departmentList['data'],
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  // Update a KPI Rating
  updateKpiGroup(details) {
    this.dialog.open(CreateKpiGroupComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: true,
        departments: this.departmentList['data'],
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a KPI Rating
  deleteKpiGroup(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.groupName + ' KPI Group',
      message: 'Are you sure you want to remove this kpi group?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpiGroup(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This KPI rating has been deleted successfully');
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

  /* KPI Functions */

  // Create a KPI
  addKpi(groupId: string) {
    this.dialog.open(CreateKpiComponent, {
      width: '30%',
      height: 'auto',
      data: {
        groupId: groupId,
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  // Update a KPI
  updateKpi(details) {
    this.dialog.open(CreateKpiComponent, {
      width: '30%',
      height: 'auto',
      data: {
        groupId: details.kpiGroupId,
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a KPI Rating
  deleteKpi(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.kpiName + ' KPI',
      message: 'Are you sure you want to remove this kpi?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpi(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This KPI has been deleted successfully');
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


  /* Appraisal Period Functions */

  //Create an Appraisal Period
  addAppraisalPeriod() {
    this.dialog.open(CreateAppraisalPeriodComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Edit an Appraisal Period
  openEditModal() {
    this.dialog.open(CreateAppraisalPeriodComponent, {
      width: '30%',
      height: 'auto',
      data: {
        name: this.periodInView.appraisalPeriodName,
        id: this.periodInView._id,
        isExisting: true,
        modalInfo: this.periodInView
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });;
  }

  //Delete a Appraisal Period
  deleteAppraisalPeriod(info?: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.appraisalPeriodName + ' Period',
      message: 'Are you sure you want to remove this period?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteAppraisalPeriod(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This Appraisal period has been deleted successfully');
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

  /* KPI Rating Functions*/

  // Create a KPI Rating
  addRating() {
    this.dialog.open(CreateRatingScaleComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: false
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  // Update a KPI Rating
  updateKpiRating(details) {
    this.dialog.open(CreateRatingScaleComponent, {
      width: '30%',
      height: 'auto',
      data: {
        isExisting: true,
        modalInfo: details
      },
    }).afterClosed().subscribe(() => {
      this.getPageData();
    });
  }

  //Delete a KPI Rating
  deleteKpiRating(info: any) {
    this.notifyService.confirmAction({
      title: 'Remove ' + info.ratingName + ' Rating',
      message: 'Are you sure you want to remove this kpi rating?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteKpiRating(info._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notifyService.showInfo('This KPI rating has been deleted successfully');
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


  setAppraisalData(details) {

  }

}
