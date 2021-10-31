import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { Result } from 'src/app/result';
import { SharedService } from 'src/app/shared.service';
import { ItemData, planList } from '../planList';
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

  containerIndex!: number;

  public validateForm!: FormGroup;
  public addContainer(): void {
    this.containerContent.push(
      this.fb.group({
        containerId: [null, [Validators.required]],
        containerNo: [null, [Validators.required]],
        enterTime: [null, [Validators.required]],
        ctnNetWeight: [null, [Validators.required]],
      })
    );
  }
  public removeContainer(containerIndex: number): void {
    this.containerContent.removeAt(containerIndex);
  }
  get containerContent(): FormArray {
    return this.validateForm.get('containerContent') as FormArray;
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
  ) {
    this.validateForm = this.fb.group({
      ctnSize: [null, [Validators.required]],
      ctnType: [null, [Validators.required]],
      planId: [null, [Validators.required]],
      vessel: [null, [Validators.required]],
      voyage: [null, [Validators.required]],
      billNo: [null, [Validators.required]],
      remark: [null, [Validators.required]],
      containerContent: this.fb.array([
        this.fb.group({
          containerId: [null, [Validators.required]],
          containerNo: [null, [Validators.required]],
          enterTime: [null, [Validators.required]],
          ctnNetWeight: [null, [Validators.required]],
        }),
      ]),
    });
  }
  index: Array<string> = [];
  ngOnInit(): void {
    console.log(this.method);
    if (this.method == 'add') {
      this.add = true;
      this.update = false;
    } else {
      this.add = false;
      this.update = true;
      this.validateForm.controls['planId'].clearAsyncValidators();
    }

    this.validateForm.setValue({
      ctnSize: 40,
      ctnType: 'L',
      planId: 'a1',
      vessel: 'null',
      voyage: 'null',
      billNo: 'null',
      remark: 'null',
      containerContent: [
        {
          containerId: 'null',
          containerNo: 'null',
          enterTime: '2021-10-31T05:12:58.631Z',
          ctnNetWeight: 'null',
        },
      ],
    });

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
