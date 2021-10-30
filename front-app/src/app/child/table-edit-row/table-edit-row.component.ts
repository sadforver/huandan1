import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
 
 
interface ItemData {
  id: string;
  name: string;
  mobile: string;
  address: string;
}
 
@Component({
  selector: 'app-table-edit-row',
  templateUrl: './table-edit-row.component.html',
  styleUrls: ['./table-edit-row.component.scss']
})
 
export class TableEditRowComponent implements OnInit {
  validateForm!: FormGroup;
 
  current:number = 1;
 
  i = 0;
  rowData: object = {};
  editId: string | null = null;
  listOfData: ItemData[] = [{
    id: '001',
    name: '小明1',
    mobile: '13120257131',
    address: '上海',
  }, {
    id: '002',
    name: '小明2',
    mobile: '13120257132',
    address: '北京',
  },{
    id: '003',
    name: '小明3',
    mobile: '13120257131',
    address: '广州',
  }];
 
  startEdit(rowData: any): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.validateForm.valid) {
      this.message.create('error', '只能同时编辑一行')
    } else {
      this.rowData = rowData;
      this.editId = rowData.id;
    }
 
  }
 
  stopEdit(row: any): void {
    //取消 有bug 暂时先不显示
    for (let index = 0; index < this.validateForm.value.aliases.length; index++) {
      const element = this.validateForm.value.aliases[index];
      if (element.id == row.id) {
        this.validateForm.value.aliases[index] = this.rowData;
        console.log('this.validateForm.value.aliases', this.validateForm.value.aliases)
      }
    }
    let tempList = this.validateForm.value.aliases;
    this.validateForm.patchValue({
      aliases: tempList
    })
    this.editId = null;
  }
 
  addRow(): void {
    let allowAdd = false;
    for (let index = 0; index < this.validateForm.value.aliases.length; index++) {
      const element = this.validateForm.value.aliases[index];
      if (element.name && element.mobile && element.address) {
        allowAdd = true;
      } else {
        allowAdd = false;
      }
    }
    if (allowAdd) {
      // if (this.validateForm.valid) {
      let editId = JSON.stringify(Date.now());
      this.aliases.push(this.fb.group({
        id: editId,
        name: ['', [Validators.required]],
        mobile: ['', [Validators.required, this.confirmationValidator]],
        address: ['', [Validators.required]],
      }))
      this.editId = editId;
    } else {
      this.message.create('error', '只能新增一行')
    }
  }
  saveRow() {
    // this.editId = null;
    if (this.validateForm.valid) {
      this.editId = null;
      console.log('value', this.validateForm.value.aliases)
    } else {
      this.message.create('error', '请完善此行信息')
    }
  }
  submitData() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (!this.validateForm.valid) {
      this.message.create('error', '请补全信息')
    }
    if (this.validateForm.valid) {
      console.log('submit:', this.validateForm.value.aliases)
    }
  }
 
  deleteRow(index: any): void {
    // console.log(index);
    this.removeFormArrayItem(index);
    console.log('this.validateForm.value.aliases', this.validateForm.value.aliases)
    // this.listOfData = this.listOfData.filter(d => d.id !== id);
  }
  get aliases() {
    return this.validateForm.get('aliases') as FormArray;
  }
  //删除表单组
  removeFormArrayItem(index: any) {
    this.aliases.removeAt(index);
  }
  // 生成唯一值
  getUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (!(/^1[3456789]\d{9}$/.test(control.value))) {
      return { confirm: true, error: true };
    }
    return {};
  };
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
 
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      aliases: this.fb.array([])
    })
    for (let index = 0; index < this.listOfData.length; index++) {
      const element = this.listOfData[index];
      this.aliases.push(this.fb.group({
        id: element.id,
        name: [element.name, [Validators.required]],
        mobile: [element.mobile, [Validators.required, this.confirmationValidator]],
        address: [element.address, [Validators.required]],
      }))
    }
    // console.log(this.validateForm)
    console.log(this.aliases.controls)
  }
}
 
 