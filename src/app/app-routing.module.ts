import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainNavComponent } from './main-nav/main-nav.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { StudentGuard } from './guards/student.guard';
import { TeacherGuard } from './guards/teacher.guard';


const routes: Routes = [
  {
    path: '',
    component: MainNavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./components/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'student',
        canActivate: [StudentGuard],
        loadChildren: () =>
          import('./components/student/student.module').then(
            (m) => m.StudentModule
          ),
      },
      {
        path: 'teacher',
        canActivate: [TeacherGuard],
        loadChildren: () =>
          import('./components/teacher/teacher.module').then(
            (m) => m.TeacherModule
          ),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
