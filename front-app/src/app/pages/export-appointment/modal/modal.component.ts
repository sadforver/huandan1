import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  controlArray: Array<{ index: number; show: boolean }> = [];
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  isCollapse = true;
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.controlArray.forEach((c, index) => {
      c.show = this.isCollapse ? index < 6 : true;
    });
  }

  resetForm(): void {
    this.validateForm.reset();
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    console.log(this.validateForm.value);
  }




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
  ) {}
  ngOnInit(): void {
    // this.validateForm.setValue(this.dataItem);
    // console.log(this.method);
    // if (this.method == 'add') {
    //   this.add = true;
    //   this.update = false;
    // } else {
    //   this.add = false;
    //   this.update = true;
    //   this.validateForm.controls['planId'].clearAsyncValidators();
    // }

    this.validateForm = this.fb.group({});
    for (let i = 0; i < 16; i++) {
      this.controlArray.push({ index: i, show: i < 6 });
      this.validateForm.addControl(`field${i}`, new FormControl());
    }

    this.addField();

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
