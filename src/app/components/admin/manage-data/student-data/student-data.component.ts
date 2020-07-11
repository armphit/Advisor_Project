import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import * as XLSX from 'xlsx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.scss'],
})
export class StudentDataComponent implements OnInit {
  public filesName: any = 'โปรดเลือกไฟล์';
  public data: Array<any>;
  public dataFaculty: any = null;
  public codeFaculty: any = null;
  public dataMajor: any = null;
  public nameMajor: any = null;
  public acronym: any = null;
  public codeMajor: any = null;
  public dataBranch: any = null;
  public codeBranch: any = null;
  public dataTeacher: any = null;
  public codeBranchhead: any = null;
  public dataBranchhead: any = null;
  public nameBranchhead: any = null;
  public advisorID: any = null;
  public dataGroup: any = null;
  public groupID: any = null;
  public groupName: any = null;
  public groupUser_name: any = null;
  public dataStudent: any = null;
  classes: any = null;
  fileCurriculum: File = null;
  public formCurriculum: FormGroup;
  public dataCurriculum: any = null;
  public filesName2: any = 'โปรดเลือกไฟล์';
  public range: Array<any> = [];
  term: any = null;
  selected: any = null;
  public formYearTerm: FormGroup;
  public dataEducational: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
    this.getYear();
  }

  ngOnInit(): void {
    this.formCurriculum = this.formBuilder.group({
      classes: ['', Validators.required],
      Upload: ['', Validators.required],
    });

    this.formYearTerm = this.formBuilder.group({
      year: ['', Validators.required],
      term: ['', Validators.required],
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
    this.dataMajor = null;
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
  }

  public clickBranch(codeBranch, name, acronym) {
    this.acronym = acronym;
    this.codeBranch = codeBranch;
    this.getGroup();
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
  public async clickGroup(
    codeGroup: any,
    namegroup: any,
    titlename: any,
    fname: any,
    lname: any
  ) {
    this.groupID = codeGroup;
    this.groupName = namegroup;
    this.groupUser_name = titlename + fname + ' ' + lname;
    this.getStudent();
  }

  async uploadFile(evt: any) {
    this.filesName = evt.target.files[0].name;

    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws, { header: 2 });
      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  public async uploadStudent() {
    for (let i = 0; i < this.data.length; i++) {
      //  let getData: any = await this.http.get('admin/uploadStudent/'+this.data[i]);
      //  console.log(getData)
      let Form = new FormData();
      Object.keys(this.data[i]).forEach((key) => {
        Form.append(key, this.data[i][key]);
      });
      Form.append('group', this.groupID);
      let getData: any = await this.http.post('admin/uploadStudent', Form);
      console.log(getData);
    }

    this.getStudent();
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'เพิ่มข้อมูลสำเร็จ',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  public async getStudent() {
    let formData = new FormData();
    formData.append('group', this.groupID);
    let getData: any = await this.http.post('admin/getStudent', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataStudent = getData.response.result;
      } else {
        this.dataStudent = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }

  public deleteStudent = async (code: any) => {
    let formData = new FormData();
    formData.append('ID', code);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('admin/delStudent', formData);
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
            this.getStudent();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  uploadCurriculum(file) {
    if (file) {
      this.formCurriculum.value.upload = file;
      this.filesName2 = file.name;
    }
  }

  async clickUploadCurriculum() {
    let formData = new FormData();

    formData.append('class', this.formCurriculum.value.classes);
    formData.append('group', this.groupID);
    formData.append('upload', this.formCurriculum.value.upload);
    formData.append('group_name', this.groupName);

    let getData: any = await this.http.post(
      'admin/addUploadCurriculum',
      formData
    );
    console.log(getData);
    if (getData.connect) {
      if (getData.response.result) {
        Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
        this.getCurriculum();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }

  public clickCurriculum(e) {
    this.getCurriculum();
  }

  public async getCurriculum() {
    let formData = new FormData();
    formData.append('group', this.groupID);
    formData.append('class', this.formCurriculum.value.classes);

    let getData: any = await this.http.post('admin/getCurriculum', formData);

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

  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: year - i };
    }
  };

  public getTerm(e) {
    this.getEducational();
  }

  public getEducational = async () => {
    let formData = new FormData();
    formData.append('group', this.groupID);
    formData.append('year', this.formYearTerm.value.year);
    formData.append('term', this.formYearTerm.value.term);

    let getData: any = await this.http.post('admin/getEducational', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataEducational = getData.response.result;
      } else {
        this.dataEducational = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
}
