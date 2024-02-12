import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { FormFields } from 'src/app/shared/models/form-fields';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/app/shared/models/table-columns';
import { AuthenticationService } from 'src/app/shared/services/utils/authentication.service';
import { HumanResourcesService } from 'src/app/shared/services/hr/human-resources.service';
import { NotificationService } from 'src/app/shared/services/utils/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppraisalFormComponent implements OnInit {

  @ViewChild('commentsField') myDiv: ElementRef;

  appraisalPending: boolean = true;
  employeeDetails: any;
  employeeInViewId: string;
  appraisalInfo: any = {};
  ratingScale: any[] = [];
  appraisalFormFields: FormFields[];
  kpiRatingFormFields: FormFields[];
  appraisalForm!: FormGroup;
  kpiRatingForm!: FormGroup;
  matrixSelectOptions: any;

  appraisalPeriods: any[] = [];
  currentPeriodId: string;
  periodInView: any;

  kpiCriteria: any[] = [];

  displayedColumns: any[];
  dataSource: MatTableDataSource<any>;

  // kpiCriteria = [
  //   {
  //     groupName: 'General',
  //     groupKpis: [
  //       {
  //         kpiName: 'Company Values',
  //         kpiDescription: 'How well do you keep the values of the company?'
  //       }
  //     ]
  //   },
  //   {
  //     groupName: 'Development',
  //     groupKpis: [
  //       {
  //         kpiName: 'Excellence',
  //         kpiDescription: 'How well do you pay attention to details?'
  //       },
  //       {
  //         kpiName: 'Technical Knowledge',
  //         kpiDescription: 'How well do you know about technical functionalities?'
  //       }
  //     ]
  //   },
  //   {
  //     groupName: 'Sales Dept',
  //     groupKpis: [
  //       {
  //         kpiName: 'Return on investment',
  //         kpiDescription: 'How effective was your sales reach?'
  //       },
  //       {
  //         kpiName: 'Customer Conversion',
  //         kpiDescription: 'How many customers are you able to reach out to?'
  //       }
  //     ]
  //   }
  // ]

  //KPI Ratings Table Column Names
  tableColumns: TableColumn[] = [
    // {
    //   key: "kpiName",
    //   label: "KPI Name",
    //   order: 1,
    //   columnWidth: "16%",
    //   cellStyle: "width: 100%",
    //   sortable: false
    // },
    {
      key: "kpiDescription",
      label: "KPI Description",
      order: 2,
      columnWidth: "20%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "employeeRating",
      label: "Employee Rating",
      order: 3,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "employeeComments",
      label: "Employee Comments",
      order: 4,
      columnWidth: "22%",
      cellStyle: "width: 100%",
      sortable: true
    },
    {
      key: "managerRating",
      label: "Manager Rating",
      order: 5,
      columnWidth: "15%",
      cellStyle: "width: 100%",
      sortable: false
    },
    {
      key: "managerComments",
      label: "Manager Comments",
      order: 6,
      columnWidth: "22%",
      cellStyle: "width: 100%",
      sortable: true
    },

  ]

  constructor(
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private hrService: HumanResourcesService,     
    private notifyService: NotificationService,
    private authService: AuthenticationService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.getInitialData();
    this.appraisalForm = this.fb.group({});

    this.matrixSelectOptions = {
      Low: 'Low',
      Moderate: 'Moderate',
      High: 'High'
    }

    this.appraisalFormFields = [
      {
        controlName: 'employeeName',
        controlType: 'text',
        controlLabel: 'Employee Name',
        controlWidth: '100%',
        initialValue: 'Aghogho Etibo',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeSignature',
        controlType: 'text',
        controlLabel: 'Employee Signature',
        controlWidth: '100%',
        initialValue: 'Aghogho Etibo',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeSignDate',
        controlType: 'text',
        controlLabel: 'Employee Signature Date',
        controlWidth: '100%',
        initialValue: 'January 1, 2024',
        validators: null,
        order: 2
      },
      {
        controlName: 'employeePotential',
        controlType: 'select',
        controlLabel: 'Employee Potential',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          Low: 'Low',
          Moderate: 'Moderate',
          High: 'High'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'employeePerformance',
        controlType: 'select',
        controlLabel: 'Employee Performance',
        controlWidth: '48%',
        initialValue: '',
        selectOptions: {
          Low: 'Low',
          Moderate: 'Moderate',
          High: 'High'
        },
        validators: [Validators.required],
        order: 6
      },
      {
        controlName: 'managerSummary',
        controlType: 'text',
        controlLabel: 'Manager Summary',
        controlWidth: '100%',
        initialValue: '',
        validators: [Validators.required],
        order: 4
      },
      {
        controlName: 'managerName',
        controlType: 'text',
        controlLabel: 'Manager Name',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 4
      },
      {
        controlName: 'managerSignature',
        controlType: 'text',
        controlLabel: 'Manager Signature',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 5
      },
      {
        controlName: 'managerSignDate',
        controlType: 'text',
        controlLabel: 'Manager Signature Date',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 6
      }
    ]

    this.kpiRatingFormFields = [
      {
        controlName: 'employeeRating',
        controlType: 'text',
        controlLabel: 'Employee Rating',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 1
      },
      {
        controlName: 'employeeComments',
        controlType: 'text',
        controlLabel: 'Employee Comments',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 2
      },
      {
        controlName: 'managerRating',
        controlType: 'text',
        controlLabel: 'Manager Rating',
        controlWidth: '100%',
        initialValue: '',
        validators: [Validators.required],
        order: 3
      },
      {
        controlName: 'managerComments',
        controlType: 'text',
        controlLabel: 'Manager Comments',
        controlWidth: '100%',
        initialValue: '',
        validators: null,
        order: 4
      },
    ]

    //Final form details fields generation
    this.appraisalFormFields.forEach(field => {
      const formControl = this.fb.control(field.initialValue, field.validators)
      this.appraisalForm.addControl(field.controlName, formControl)
    })

  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.tableColumns.sort((a,b) => (a.order - b.order));
    this.displayedColumns = this.tableColumns.map(column => column.label);
  }

  getInitialData = async () => {
    this.employeeInViewId = this.activatedRoute.snapshot.params["id"];
    console.log(this.employeeInViewId);
    if(this.employeeInViewId) {
      this.appraisalPending = false;
    }
    else {
      this.employeeDetails = this.authService.loggedInUser.data;
      this.employeeInViewId = this.employeeDetails._id;
    }
    // this.kpiGroups = await this.hrService.getKpiGroups().toPromise();
    this.ratingScale = await this.hrService.getKpiRatings().toPromise();
    this.appraisalPeriods = await this.hrService.getAppraisalPeriods().toPromise();
    console.log(this.appraisalPeriods);
    this.currentPeriodId = this.appraisalPeriods['data'][0]['_id'];
    this.getPageData();
  }

  getPageData = async () => {
    this.periodInView = await this.hrService.getEmployeeAppraisalDetails(this.employeeInViewId, this.currentPeriodId).toPromise();
    this.periodInView = this.periodInView['data'][0];
    console.log(this.periodInView);
    this.kpiCriteria = this.periodInView.kpiGroups;

    // KPI Rating Form Declaration
    this.kpiRatingForm = this.fb.group({
      kpiGroups: this.fb.array([])
    });
    
    this.displayKpiRatings();
    this.populateGrps();
  }

  populateGrps() {
    this.kpiCriteria.forEach((item, index) => {
      item.groupKpis.forEach(kpi => {
        this.createKpis(item.groupName, index, kpi);
      })
    })
  }

  // Get form controls of KPI Rating Form
  // get kpiGroupsArray() {
  //   return <FormArray>this.kpiRatingForm.get('kpiGroups');
  // }
  groups(): FormArray {
    return <FormArray>this.kpiRatingForm.get('kpiGroups');
    // return this.kpiRatingForm.get("kpiGroups") as FormArray
  }

  // Generate form view with initial values from KPI Group array
  displayKpiRatings() {
    let kpiInfo = this.kpiCriteria.map((grp: any, grpIndex: number) =>
      this.initKpiGroups(grp, grpIndex)
    );
    this.kpiRatingForm.setControl('kpiGroups', this.fb.array(kpiInfo));
  }

  // Initialize form group for each KPI Group
  initKpiGroups(kpiGroup: any, grpIndex:number): FormGroup {
    return this.fb.group({
      [kpiGroup.groupName]: this.fb.array([])
    })
  }

  // Generate dynamic kpi arrays for each kpi group 
  // generateKpisArray(grpName: string, grpIndex: number, grpKpis: any) {
  //   return grpKpis.map(kpi => {
  //     this.initKpis(kpi);
  //   });
  // }

  // Set kpi rating controls after form group generation
  grpKpis(grpIndex:number, grpName: string,) : FormArray {
    return this.groups().at(grpIndex).get(grpName) as FormArray
  }

  // Initialize form group of each KPI entry
  initKpis(kpi: any) {
    return this.fb.group({
      [kpi.kpiName]: this.fb.group({
        employeeRating: [kpi.remarks?.employeeRating, Validators.required],
        employeeComments: [kpi.remarks?.employeeComment, Validators.required],
        managerRating: [kpi.remarks?.managerRating, Validators.required],
        managerComments: [kpi.remarks?.managerComment, Validators.required]
      })
    })
  }

  // Push each created form group into the kpi array
  createKpis(groupName: string, groupIndex:number, kpi: any) {
    this.grpKpis(groupIndex, groupName).push(this.initKpis(kpi));
  }

  rateEmployee(val) {
    console.log(val);
  }

  submit() {
    console.log(this.kpiRatingForm.value);
  }

  setAppraisalData = async (details) => {
    console.log(details);
    this.periodInView = details;
    this.currentPeriodId = details._id;
    this.getPageData();
  }

  ratingByEmployee(i, grpName, j, kpiName, ratingVal) {
    let employeeCtrl = this.kpiRatingForm.get(['kpiGroups', i, grpName, j, kpiName]) as FormGroup;
    employeeCtrl.get('employeeRating').setValue(ratingVal);
  }

  ratingByManager(i, grpName, j, kpiName, ratingVal) {
    let employeeCtrl = this.kpiRatingForm.get(['kpiGroups', i, grpName, j, kpiName]) as FormGroup;
    employeeCtrl.get('managerRating').setValue(ratingVal);
  }

  strToDate(dateVal: string, key:string) {
    // console.log(dateVal);
    if(key == 'startDate' || key == 'endDate') {
      let newFormat = new Date(dateVal);
      return this.datePipe.transform(newFormat, 'd MMM, y')
    }
    else {
      const [day, month, year] = dateVal.split('/');
      let newFormat = new Date(+year, +month - 1, +day);
      // console.log(newFormat.toDateString());
      return this.datePipe.transform(newFormat, 'd MMMM, y')
    }    
  }

} 
