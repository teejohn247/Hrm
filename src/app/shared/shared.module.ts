import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule }  from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { CreateSingleInfoComponent } from './components/create-single-info/create-single-info.component';
import { RegisterGuestComponent } from './components/register-guest/register-guest.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { LeaveReviewComponent } from './components/leave-review/leave-review.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const SHARED_COMP = [
  MatIconModule,
  MatTableModule,
  MatCheckboxModule,
  MatChipsModule,
  MatSortModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule,
  MatSidenavModule
];

@NgModule({
  declarations: [DeleteConfirmationComponent, CreateSingleInfoComponent, RegisterGuestComponent, LoginComponent, ConfirmationDialogComponent, LeaveReviewComponent, PaymentInfoComponent, DashboardComponent],

  exports: [
    ...SHARED_COMP,
    FormsModule,
    ReactiveFormsModule,
  ],

  imports: [
    ...SHARED_COMP,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule,
    HighchartsChartModule
  ],
  providers : [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ]
})
export class SharedModule {
}
