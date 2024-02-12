import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/shared/components/dashboard/dashboard.component';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { HasRoleGuard } from 'src/app/shared/services/utils/has-role.guard';
import { UserAuthGuard } from 'src/app/shared/services/utils/user-auth.guard';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'human-resources',
        loadChildren: () => import('../hr/hr.module').then(m => m.HrModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
        // data: {
        //   role: 'HrAdmin'
        // }
      }
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
