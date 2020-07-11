import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { AdviceDataComponent } from './advice-data/advice-data.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'upload-file',
        component: UploadFileComponent,
      },
      {
        path: 'advice-data',
        component: AdviceDataComponent,
      },
      {
        path: '',
        redirectTo: '/student/upload-file',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/student',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
