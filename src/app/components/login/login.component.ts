import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;

  constructor(
    public service: HttpService,
    private routes: Router,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute
  ) {}
  public msg: any = null;
  private adminPath: string = '/admin';
  private studentPath: string = '/student';
  private teacherPath: string = '/teacher';

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.activeRoute.queryParams.subscribe((value: any) => {
      console.log(value.sso);
      // if (value.oldPath) this.oldPath = value.oldPath;
      if (value.sso) {
        this.service
          .get(`/loginsso?perid=${value.perid}`)
          .then((value: any) => {
            console.log(value.response);
            if (value.response.success) {
              let a = value.response.data.userID;
              console.log(a);
              this.onlogin(a);
            } else {
              window.location.replace(environment.ssoLogout);
              this.service.alertLog('error', 'ไม่พบข้อมูลผู้ใช้งาน');
            }
          });
      }
    });
  }

  public async submitlogin() {
    let formData = new FormData();
    formData.append('ID', this.formLogin.value.username);
    formData.append('pass', this.formLogin.value.password);
    let httpRespon: any = await this.service.post('loginAdmin', formData);
    // console.log(httpRespon.response.data.status);
    if (httpRespon.connect) {
      if (httpRespon.response.success) {
        if (httpRespon.response.data.status == 'Admin') {
          this.service.alertLog('success', 'เข้าสู่ระบบสำเร็จ');
          //this.router.navigate(["/home"]);
          this.service.navRouter(this.adminPath);

          localStorage.setItem(
            'userLogin',
            JSON.stringify(httpRespon.response.data)
          );
        }
      } else {
        this.service.alertLog('error', 'ชื่อหรือรหัสผ่านไม่ถูกต้อง');
      }
    } else {
      this.service.alertLog('error', 'เชื่อมต่อเซิร์ฟเวอร์ผิดพลาด');
    }
  }
  public async onlogin(a) {
    let formData = new FormData();
    formData.append('ID', a);
    let httpRespon: any = await this.service.post('login', formData);

    console.log(httpRespon);
    if (httpRespon.connect) {
      if (httpRespon.response.success) {
        if (httpRespon.response.data.status == '4500') {
          this.service.alertLog('success', 'เข้าสู่ระบบสำเร็จ');
          this.service.navRouter(this.studentPath);

          localStorage.setItem(
            'userLogin',
            JSON.stringify(httpRespon.response.data)
          );
        } else if (httpRespon.response.data.status == '2500') {
          this.service.alertLog('success', 'เข้าสู่ระบบสำเร็จ');
          this.service.navRouter(this.teacherPath);

          localStorage.setItem(
            'userLogin',
            JSON.stringify(httpRespon.response.data)
          );
        }
      } else {
        this.service.alertLog('error', 'ชื่อหรือรหัสผ่านไม่ถูกต้อง');
      }
    } else {
      this.service.alertLog('error', 'เชื่อมต่อเซิร์ฟเวอร์ผิดพลาด');
    }
  }

  public openSSO = async () => {
    window.location.replace(environment.ssoLogin);
  };
}
