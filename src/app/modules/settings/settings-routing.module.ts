import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralSettingsComponent } from './general/general-settings/general-settings.component';
import { HumanResourcesSettingsComponent } from './human-resources/human-resources-settings/human-resources-settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'general-settings',
    pathMatch: 'full'
    //component: EmployeesListComponent
  },
  {
    path: 'general-settings',
    component: GeneralSettingsComponent
  },
  {
    path: 'human-resources-settings',
    component: HumanResourcesSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
