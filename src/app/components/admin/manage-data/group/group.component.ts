import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public dataFaculty: any = null;
  public codeFaculty: any = null;
  public dataMajor: any = null;
  public nameMajor: any = null;
  public acronym: any = null;
  public inGroup: FormGroup;
  public codeMajor: any = null;
  public dataBranch: any = null;
  public codeBranch: any = null;
  public dataTeacher: any = null;
  public codeBranchhead: any = null;
  public inBranchhead: FormGroup;
  public dataBranchhead: any = null;
  public nameBranchhead: any = null;
  public IDBranchhead: any = null;
  public advisorID: any = null;
  public dataGroup: any = null;
  public groupUser_edit: any = null;
  public groupID_edit: any = null;

  constructor(private http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
  }

  ngOnInit(): void {
    this.inGroup = this.formBuilder.group({
      group: ['', Validators.required],
      advisorID: ['', Validators.required],
    });

    this.inBranchhead = this.formBuilder.group({
      Branchhead: ['', Validators.required],
    });
  }

  public getFaculty = async () => {
    let getData: any = await this.http.post('admin/getFaculty');
    if (getData.connect) {
      if (getData['response']['rowCount'] > 0) {
        this.dataFaculty = getData['response']['result'];
      } else {
        this.dataFaculty = [];
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public async clickFaculty(codeFaculty, nameFaculty) {
    this.codeFaculty = codeFaculty.substr(0, 2);
    let formData = new FormData();
    formData.append('code', this.codeFaculty);
    let getData: any = await this.http.post('admin/getMajor', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataMajor = getData.response.result;
      } else {
        this.dataMajor = null;

      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }

  public async clickMajor(codeMajor, nameMajor, acronym) {
    this.nameMajor = nameMajor;
    this.codeMajor = codeMajor;
    let formData = new FormData();
    formData.append('code', this.codeMajor);
    let getData: any = await this.http.post('admin/getBranch', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranch = getData.response.result;
      } else {
        this.dataBranch = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }

    formData.append('ID', this.codeMajor);
    let getData2: any = await this.http.post('admin/getTeacher', formData);
    if (getData2.connect) {
      if (getData2.response.rowCount > 0) {
        this.dataTeacher = getData2.response.result;
      } else {
        this.dataTeacher = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
    this.getBranchhead();
    this.getGroup();
  }

  public clickBranch(codeBranch, name, acronym) {
    this.acronym = acronym;
    this.codeBranch = codeBranch;
    this.getGroup();
  }

  public clickAdvisor(advisorID) {
    this.advisorID = advisorID;
    console.log(this.codeBranch);
  }

  public clearFrom() {
    this.inGroup.reset();
    this.inBranchhead.reset();
  }

  public getIDBranchhead(codeBranchhead) {
    this.codeBranchhead = codeBranchhead;
    this.inBranchhead = this.formBuilder.group({
      Branchhead: [codeBranchhead, Validators.required],
    });
  }

  public async updateBranchhead() {
    let formData = new FormData();
    formData.append('code', this.codeMajor);
    formData.append('ID', this.inBranchhead.value.Branchhead);
    console.log(formData.get('ID'));
    if (this.codeBranchhead == this.inBranchhead.value.Branchhead) {
      Swal.fire('กรุณาเลือกอาจารย์อีกครั้ง!', '', 'error');
    } else {
      let getData: any = await this.http.post(
        'admin/updateBranchhead',
        formData
      );
      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
          let win: any = window;
          win.$('#addHead').modal('hide');
          this.getBranchhead();
        } else {
          Swal.fire('แก้ไขข้อมูลข้อมูลไม่ได้', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  }

  public getBranchhead = async () => {
    let formData = new FormData();
    formData.append('code', this.codeMajor);
    let getData: any = await this.http.post('admin/getBranchhead', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranchhead = getData.response.result;
      } else {
        this.dataBranchhead = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
    this.IDBranchhead = getData.response.result[0].userID;
    let a =
      getData.response.result[0].titlename +
      getData.response.result[0].fname +
      ' ' +
      getData.response.result[0].lname;

    if (a == '0 null') {
      a = '';
      this.nameBranchhead = a;
    } else {
      this.nameBranchhead = a;
    }
  };

  public insertGroup = async () => {
    let formData = new FormData();
    formData.append(
      'group_name',
      this.acronym + '.' + this.inGroup.value.group.toUpperCase()
    );
    formData.append('ID', this.inGroup.value.advisorID);
    formData.append('codeBranch', this.codeBranch);

    // formData.append('ID', this.inGroup.value.getTC);
    let getData: any = await this.http.post('admin/addGroup', formData);
    console.log(getData);
    if (getData.connect) {
      if (getData.response.result) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#addGroup').modal('hide');
        this.getGroup();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public getGroup = async () => {
    let formData = new FormData();
    formData.append('codeBranch', this.codeBranch);
    let getData: any = await this.http.post('admin/getGroup', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGroup = getData.response.result;
      } else {
        this.dataGroup = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public deleteGroup = async (group_id: any) => {
    let formData = new FormData();
    formData.append('code', group_id);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('admin/delGroup', formData);
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
            this.getGroup();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  public getIDgroup = async (advisorID: any, group: any) => {
    console.log(advisorID);
    this.groupID_edit = group;
    this.groupUser_edit = advisorID;
    this.inGroup = this.formBuilder.group({
      advisorID: [advisorID, Validators.required],
    });
  };

  public updateGroup = async () => {
    let formData = new FormData();
    formData.append('ID', this.inGroup.value.advisorID);
    formData.append('group', this.groupID_edit);

    console.log(this.groupID_edit);
    if (this.inGroup.value.advisorID == this.groupUser_edit) {
      Swal.fire('กรุณาเลือกอาจารย์อีกครั้ง!', '', 'error');
    } else {
      let getData: any = await this.http.post('admin/updateGroup', formData);
      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          let win: any = window;
          win.$('#updateGroup').modal('hide');
          Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
          this.getGroup();
        } else {
          Swal.fire('แก้ไขข้อมูลไม่สำเร็จ', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };
}
