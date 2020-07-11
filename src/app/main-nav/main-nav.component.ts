import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  public dataProfile =
    JSON.parse(localStorage.getItem('userLogin')).titlename +
    JSON.parse(localStorage.getItem('userLogin')).fname +
    '  ' +
    JSON.parse(localStorage.getItem('userLogin')).lname;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  public status: any = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private http: HttpService
  ) {
    var data: any = JSON.parse(localStorage.userLogin);
    var json: any = data.status;
    this.status = json;
  }

  public onLogout = () => {
    this.http
      .confirmAlert('คุณต้องการออกจากระบบใช่หรือไม่ ?')
      .then(async (value: any) => {
        if (value) {
          window.location.replace(environment.ssoLogout);
          localStorage.clear();
        }
      });
  };
}
