import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { Result } from 'src/app/result';
import { SharedService } from 'src/app/shared.service';
import { planList } from '../planList';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() dataItem!: planList;
  @Input() method!: string;
  isDisable: boolean = true;
  validateForm!: FormGroup;
  add: boolean = false;
  update: boolean = false;
  public showLoading = false;
  gender = 'F';
  planType = 'M';
  valid!: boolean;
  private submitForm$ = new Subject<planList>();
  private updateForm$ = new Subject<planList>();
  submitresult$!: Observable<Result<planList>>;
  updateresult$!: Observable<Result<planList>>;
  controlArray: Array<{ index: string; show: boolean }> = [];
  addsubmit(value: planList) {
    this.showLoading = true;
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    setTimeout(() => {
      console.log(this.validateForm.valid);
      if (this.validateForm.valid) {
        this.showLoading = false;
        this.submitForm$.next(value);
      } else {
        this.showLoading = false;
      }
    }, 2000);
  }
  updatesubmit(value: planList) {
    this.showLoading = true;
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    setTimeout(() => {
      if (this.validateForm.valid) {
        this.showLoading = false;
        this.updateForm$.next(value);
      } else {
        this.showLoading = false;
      }
    }, 2000);
  }

  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项',
    },
    en: {
      required: 'Input is required',
    },
    default: {
      email: '邮箱格式不正确/The input is not valid email',
    },
  };
  a: number = 0;

  close() {
    this.modalRef.destroy();
  }
  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {
    // const { required, maxLength, minLength, email, mobile, idNo } =
    //   MyValidators;
    // this.validateForm = this.fb.group({
    //   planId: [
    //     '',
    //     [required, maxLength(12), minLength(12)],
    //     ValidateStudentExist.createValidator(this.sharedService),
    //   ],
    //   planName: ['', [required]],
    //   gender: ['F', [required]],
    //   schoolYear: ['2021-01-01', [required]],
    //   telephone: ['', [required, mobile]],
    //   email: ['', [required, email]],
    //   planType: ['M', [required]],
    //   idNo: ['', [required, maxLength(18), minLength(18), idNo]],
    //   avatarUrl: ['', []],
    // });
      }
    index:Array<string>=[]
  ngOnInit(): void {
   
    this.validateForm = this.fb.group({});
    this.index=Object.keys(this.dataItem) ;
    console.log(this.index)

    for (let i = 0; i < this.index.length; i++) {
      this.controlArray.push({ index: this.index[i], show: i < 6 });
      this.validateForm.addControl(`${this.index[i]}`, new FormControl());
    }
    this.validateForm.setValue(this.dataItem);
    console.log(this.method);
    if (this.method == 'add') {
      this.add = true;
      this.update = false;
    } else {
      this.add = false;
      this.update = true;
      this.validateForm.controls['planId'].clearAsyncValidators();
    }

    this.submitresult$ = this.submitForm$.pipe(
      exhaustMap((value) => this.sharedService.addStudent(value))
    );

    this.submitresult$.subscribe({
      next: (res) => {
        alert(res.message.toString());
        this.modalRef.destroy('suc');
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
    this.updateresult$ = this.updateForm$.pipe(
      exhaustMap((value) => this.sharedService.updateStudent(value))
    );
    this.updateresult$.subscribe({
      next: (res) => {
        alert(res.message.toString());
        this.modalRef.destroy('suc');
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
}
