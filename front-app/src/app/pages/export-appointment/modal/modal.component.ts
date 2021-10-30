import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  nameArry:Array<{ index: string; show: boolean }> = [];
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  i = 0;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [];
  containerIndex!:number;
  startEdit(id: string): void {
    this.editCache[id].edit = true;
    console.log("true");
    
  }
 
  stopEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);//根据id将缓存中的数据写回listOfData
    this.editCache[id].edit = false;
    console.log("false");
    
  }
 
addRow(): void {
    this.listOfData= [
      ...this.listOfData,
      {
        id: `${this.i}`,
        name: ``,
        type: ``,
        content: ``
      }
    ];
    this.i++;
    this.updateEditCache();//listOfData数据写入缓存中
  }
 
  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
 
deleteRow(id: string): void {
    this.listOfData= this.listOfData.filter(d => d.id !== id);
    //删除的时候editCache不用操作,它不需要保存..
    //编辑时删除，可以在这里记录id,传后台进行删除。
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
  get Container() {
    return this.validateForm.get('Container') as FormArray;
  }
  addContainer() {
    this.Container.push(this.fb.group({
      container_id:['',],
      container_no:['',],
      ctn_net_weight:['',],
    }));
  }
  public removeContainer(containerIndex: number): void {
    this.Container.removeAt(containerIndex);
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
     this.validateForm = this.fb.group({
      ctn_size:['',Validators.required],
      ctn_type:['',],
      plan_id: ['',],
      Container:this.fb.array([
        this.fb.group({
          container_id:['',],
          container_no:['',],
          ctn_net_weight:['',],
        })
      ])
    });
    this.addRow();

    this.validateForm = this.fb.group({});
    this.index=Object.keys(this.dataItem) ;
    console.log(this.index)

    for (let i = 0; i < this.index.length; i++) {
      this.controlArray.push({ index: this.index[i], show: i < 6 });
      this.validateForm.addControl(`${this.index[i]}`, new FormControl());
    }
    this.validateForm.setValue(this.dataItem);
    this.addField();
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
