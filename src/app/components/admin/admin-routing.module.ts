import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageDataComponent } from './manage-data/manage-data.component';
import { GroupComponent } from './manage-data/group/group.component';
import { StudentDataComponent } from './manage-data/student-data/student-data.component';
import { AdviceDataComponent } from './advice-data/advice-data.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'manage-data',
        component: ManageDataComponent,
        children: [
          {
            path: 'group',
            component: GroupComponent,
          },
          {
            path: 'student-data',
            component: StudentDataComponent,
          },
        ],
      },

      {
        path: 'advice-data',
        component: AdviceDataComponent
      },

      {
        path: '',
        redirectTo: '/admin/manage-data',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
