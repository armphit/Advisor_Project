import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public PathPDF: string =
  "http://cpe.rmuti.ac.th/project/advisor/api";

  public rootPath: string =
  "http://cpe.rmuti.ac.th/project/advisor/api/index.php/";
  constructor(public router:Router,private http: HttpClient) {}

  checkusernameandpassword(uname: string, pass: string) {
    console.log(pass)
    if (uname == 'admin' && pass == '1234') {
      localStorage.setItem('username', 'admin');
       this.router.navigate(['/admin']);
      return true;

    } else {
      return false;
    }
  }

  public post = (path: string, formdata: any = null) => {
    return new Promise((resolve) => {
      this.http
        .post(this.rootPath + path, formdata)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
        });
    });
  };

  public get = (path: string) => {
    return new Promise((resolve) => {
      this.http
        .get(this.rootPath + path)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
        });
    });
  };
  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };

  public confirmAlert = (title: string, text: string = "") => {
    return new Promise(resolve => {
      Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#007BFF",
        cancelButtonColor: "#DC3545",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        focusCancel: true,
        focusConfirm: false
      }).then(result => {
        if (result.value) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

public alertLog = (
  type: "error" | "success" ,
  title: string,
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,

    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  switch (type) {
    case "success":
      Toast.fire({
        icon: type,
        title: title
      })
      break;
    case "error":

      Toast.fire({
        icon: type,
        title: title
      })
      break;

  }
};

}
