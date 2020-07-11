import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advice-data',
  templateUrl: './advice-data.component.html',
  styleUrls: ['./advice-data.component.scss'],
})
export class AdviceDataComponent implements OnInit {
  public dataStudent: any = null;
  public thDate: any = null;
  public thTime: any = null;
  public inAdvice: FormGroup;
  public dataAdvice: any = null;
  public adviceID: any = null;
  public subjectEdit: any = null;
  public detailEdit: any = null;
  public dataAdviceNotNull: any = null;
  public thday = new Array(
    'วันอาทิตย์ ที่',
    'วันจันทร์ ที่',
    'วันอังคาร ที่',
    'วันพุธ ที่',
    'วันพฤหัส ที่',
    'วันศุกร์ ที่',
    'วันเสาร์ ที่'
  );
  public thmonth = new Array(
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  );

  constructor(private http: HttpService, private formBuilder: FormBuilder) {
    this.getStudent();
    this.getYear();
    this.getAdvice();
    this.getAdviceNotNull();
  }

  ngOnInit(): void {
    this.inAdvice = this.formBuilder.group({
      subject: ['', Validators.required],
      details: ['', Validators.required],
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

    this.thDate =
      this.thday[now.getDay()] +
      ' ' +
      now.getDate() +
      ' ' +
      'เดือน' +
      this.thmonth[now.getMonth()] +
      ' ' +
      'พ.ศ.' +
      (0 + now.getFullYear() + 543);
    this.thTime =
      'เวลา' + ' ' + now.getHours() + ':' + now.getMinutes() + ' ' + 'น.';
  };

  public insertAdvice = async () => {
    let formData = new FormData();
    var now = new Date();
    var date =
      now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append(
      'group',
      JSON.parse(localStorage.getItem('userLogin')).group
    );
    formData.append('subject', this.inAdvice.value.subject);
    formData.append('details', this.inAdvice.value.details);
    formData.append('dateNow', date);
    // formData.forEach((value,key) => {
    //   console.log(key+":"+value)
    // });

    let getData: any = await this.http.post('student/addAdvice', formData);
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#addCounsel').modal('hide');
        this.getAdvice();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public clearFrom() {
    this.inAdvice.reset();
  }

  public getAdvice = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post('student/getAdvice', formData);
    console.log(getData.response.result);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdvice = getData.response.result;
      } else {
        this.dataAdvice = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public deleteAdvice = async (advice_id: any) => {
    let formData = new FormData();
    formData.append('code', advice_id);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('student/delAdvice', formData);
        console.log(getData);
        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getAdvice();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  public clickEdit = async (subject: any, detail: any, code: any) => {
    this.adviceID = code;
    this.subjectEdit = subject;
    this.detailEdit = detail;
    this.inAdvice = this.formBuilder.group({
      subject: [subject, Validators.required],
      details: [detail, Validators.required],
    });
  };

  public updateAdvice = async () => {
    let formData = new FormData();
    formData.append('subject', this.inAdvice.value.subject);
    formData.append('detail', this.inAdvice.value.details);
    formData.append('code', this.adviceID);

    if (
      this.inAdvice.value.subject == this.subjectEdit &&
      this.inAdvice.value.details == this.detailEdit
    ) {
      Swal.fire('แก้ไขข้อมูลอีกครั้ง!', '', 'error');
    } else {
      formData.forEach((value, key) => {
        console.log(key + ':' + value);
      });
      let getData: any = await this.http.post('student/editAdvice', formData);
      console.log(getData);
      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          let win: any = window;
          win.$('#editAdvice').modal('hide');
          Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
          this.getAdvice();
        } else {
          Swal.fire('แก้ไขข้อมูลไม่สำเร็จ', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

  public getAdviceNotNull = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post(
      'student/getAdviceNotNull',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdviceNotNull = getData.response.result;
      } else {
        this.dataAdviceNotNull = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public getDate(date: any) {
    var monthNamesThai = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤษจิกายน',
      'ธันวาคม',
    ];

    var dayNames = [
      'วันอาทิตย์ที่',
      'วันจันทร์ที่',
      'วันอังคารที่',
      'วันพุทธที่',
      'วันพฤหัสบดีที่',
      'วันศุกร์ที่',
      'วันเสาร์ที่',
    ];

    var d = new Date(date);

    return (
      this.thday[d.getDay()] +
      '  ' +
      d.getDate() +
      '  ' +
      this.thmonth[d.getMonth()] +
      '  ' +
      (d.getFullYear() + 543)
    );
  }
}
