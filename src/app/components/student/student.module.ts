import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { SharedModules } from 'src/app/shared-modules';
import { AdviceDataComponent } from './advice-data/advice-data.component';


@NgModule({
  declarations: [UploadFileComponent, AdviceDataComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModules,
  ]
})
export class StudentModule { }
