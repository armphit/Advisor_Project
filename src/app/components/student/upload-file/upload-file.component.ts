import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  public dataStudent: any = null;
  public range: Array<any> = [];
  term: any = null;
  selected: any = null;
  file: File = null;
  public filesName: any = 'โปรดเลือกไฟล์';
  public filesName2: any = 'โปรดเลือกไฟล์';
  public filesName3: any = 'โปรดเลือกไฟล์';
  public fileUpload: FormGroup;
  selectUpload: any = null;
  public getHistory: any = null;
  public timetable: any = null;
  public results: any = null;
  classes: any = null;
  public dataCurriculum: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getStudent();
    this.getYear();
  }

  ngOnInit(): void {
    this.fileUpload = this.formBuilder.group({
      year: ['', Validators.required],
      term: ['', Validators.required],
      selectUpload: ['', Validators.required],
      Upload: ['', Validators.required],
    });
  }

  public getStudent = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post('student/getStudent', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataStudent = getData.response.result;
      } else {
        this.dataStudent = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: year - i };
    }
  };

  uploadFile(file) {
    if (file) {
      this.filesName = file.name;
      this.file = file;
    } else {
      this.filesName = ' ';
    }
  }

  onClickupload = async () => {
    let formData = new FormData();
    // console.log(this.fileUpload.value.resultsFile);
    formData.append('select', this.selectUpload);
    formData.append('upload', this.file);
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('year', this.fileUpload.value.year);
    formData.append('term', this.fileUpload.value.term);
    let getData: any = await this.http.post('student/addUploadfile', formData);
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
        this.getEducation();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public getSelect(e) {
    this.term = null;
  }

  public getTerm(e) {
    this.getEducation();
  }

  public getEducation = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('term', this.term);
    formData.append('year', this.selected);
    let getData: any = await this.http.post('student/getEducation', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.getHistory = getData.response.result[0].file_profile;
        this.timetable = getData.response.result[0].file_class_schedule;
        this.results = getData.response.result[0].file_course;
      } else {
        this.getHistory = null;
        this.timetable = null;
        this.results = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public clearFrom() {
    this.selectUpload.get();
  }
  public clickCurriculum(e) {
    this.getCurriculum();
  }
  public async getCurriculum() {
    let formData = new FormData();
    formData.append(
      'group',
      JSON.parse(localStorage.getItem('userLogin')).group
    );
    formData.append('class', this.classes);

    let getData: any = await this.http.post('student/getCurriculum', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataCurriculum = getData.response.result[0].curriculumFile;
      } else {
        this.dataCurriculum = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }
}
