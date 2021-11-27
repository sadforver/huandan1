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
import { ItemData, plan, planList } from '../planList';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { format } from 'date-fns';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
  private submitForm$ = new Subject<plan>();
  private updateForm$ = new Subject<plan>();
  submitresult$!: Observable<Result<plan>>;
  updateresult$!: Observable<Result<plan>>;

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

  addsubmit(value: plan) {
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
  updatesubmit(value: plan) {
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
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.validateForm = this.fb.group({
      depot: [null, [Validators.required]],
      contSize: [null, [Validators.required]],
      contType: [null, [Validators.required]],
      plan_time: [null, [Validators.required]],
      expiryDate: [null, [Validators.required]],
      vesselName: [null, [Validators.required]],
      voyage: [null, [Validators.required]],
      blNo: [null, [Validators.required]],
      operCode: [null, [Validators.required]],
      carGroupCode: [null, [Validators.required]],
      remark: [null, [Validators.required]],
      containerContent: this.fb.array([
        this.fb.group({
          container_id: [null, [Validators.required]],
          container_no: [null, [Validators.required]],
          enter_time: [null, [Validators.required]],
          ctn_net_weight: [null, [Validators.required]],
          serialNo: [null, [Validators.required]],
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
      this.validateForm.controls['plan_id'].clearAsyncValidators();
    }
    let time = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.log(time);
    this.validateForm.setValue({
      depot: 'KTIL',
      contSize: 'GP',
      contType: '20',
      plan_time: time,
      expiryDate: '',
      vesselName: 'SUYN',
      operCode: this.localStorageService.getItem('username'),
      carGroupCode: 'nulll',
      voyage: 'SYUDAY',
      blNo: 'ab34242',
      remark: 'null',
      containerContent: [
        {
          container_id: 'null',
          container_no: 'null',
          enter_time: time,
          ctn_net_weight: 'null',
          serialNo: 'aaa',
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
