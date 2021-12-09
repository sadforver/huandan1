import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable,Observer,Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Result } from 'src/app/result';
import { SharedService } from 'src/app/shared.service';
import { ModalComponent } from './modal/modal.component';
import { planList } from './planList';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'app-export-appointment',
  templateUrl: './export-appointment.component.html',
  styleUrls: ['./export-appointment.component.scss']
})
export class ExportAppointmentComponent implements OnInit {

  constructor(
    private sharedService:SharedService,
    private modal: NzModalService,
    private msg: NzMessageService,
    private localStorageService:LocalStorageService,
    // private msg: NzMessageService
  ) { }
  operCode!:string;
  plan: planList[]=[];
  searchTerm!: string | null;
  filter!: Array<{ key: string; value: string; }>;
  result$!: Observable<Result<planList[]>>;
  private searchTerm$ = new Subject<string | null>();
  loading = true;
  total = 1;
  pageIndex = 1;
  pageSize = 10;
  filterPlanStatus=[
    {text:'预约成功',value:'S'},
    {text:'预约失败',value:'F'},
    {text:'审核通过',value:'P'},
    {text:'审核驳回',value:'R'}
  ]

  loadDataFromServer(
    operCode:string,
    pageIndex: number,
    pageSize: number,
    searchTerm: string | null,
    filter: Array<{ key: string; value: string }>
  ): void {
    this.loading = true;
    this.sharedService
      .getPlan(operCode,pageIndex, pageSize, searchTerm, filter)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.total = res.count;
          this.plan = res.data;
          console.log(this.plan);
          
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      });
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex,  filter } = params;
    const searchTerm = this.searchTerm || null;
    const operCode=this.operCode;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.searchTerm = searchTerm;
    this.filter = filter;
    this.loadDataFromServer(
      operCode,
      pageIndex,
      pageSize,
      searchTerm,
      filter
    );
  }
  ngOnInit(): void {
    this.operCode=this.localStorageService.getItem('username')
    this.loadDataFromServer(
      this.operCode,
      this.pageIndex,
      this.pageSize,
      null,
      []
    );
    this.result$ = this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchTerm) =>
        this.sharedService.getPlan(
          this.operCode,
          this.pageIndex,
          this.pageSize,
          searchTerm,
          this.filter
        )
      )
    );
    this.result$.subscribe({
      next: (res) => {
        this.loading = false;
        this.total = res.count;
        this.plan = res.data;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
    console.log(this.plan)
  }
  onSend(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
    console.log(this.searchTerm$);
    this.searchTerm = searchTerm;
    this.pageIndex = 1;
    console.log(searchTerm);
  }
  setFilterAs(status:string){
    this.filter=[{key:'planStatus',value:status}]
    console.log(status)
    this.loadDataFromServer(
      this.operCode,
      this.pageIndex,
      this.pageSize,
      this.searchTerm,
      this.filter,
    );
  }
  resetFilters(){
    this.filter=[]
    this.loadDataFromServer(
      this.operCode,
      this.pageIndex,
      this.pageSize,
      this.searchTerm,
      this.filter,
    );
  }
  convertDate (date:Date, day:number):Date {
    let tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate()+day);
    let Y = tempDate.getFullYear();
    let M = tempDate.getMonth()+1 < 10 ? '0'+(tempDate.getMonth()+1) : tempDate.getMonth()+1;
    let D = tempDate.getDate() < 10 ? '0'+(tempDate.getDate()) : tempDate.getDate();
    let result = Y + "-" + M + "-" + D
    let da=new Date(result)
    return da;
  }
  createForm(): void {
    const modal = this.modal.create({
      nzTitle: '新建计划',
      nzWidth:'80%',
      nzContent: ModalComponent,
      nzComponentParams: {
        
        method: 'add',
      },
      nzClosable: false,
      nzFooter: null,
    });
    modal.afterClose.subscribe((res) => {
      console.log('afterClose-res: ', res);
      if (res) {
        console.log('更新数据啦');
        console.log(res);
        this.loadDataFromServer(
          this.operCode,
          this.pageIndex,
          this.pageSize,
          this.searchTerm,
          []
        );
      }
    });
  }
  deletePlan(dataItem: planList) {
    this.sharedService.deleteStudent(dataItem.planId).subscribe((res) => {
      alert(res['message'].toString());
      if (res['code'] == 1000) {
        this.loadDataFromServer(
          this.operCode,
          this.pageIndex,
          this.pageSize,
          this.searchTerm,
          this.filter
        );
      }
    });
  }
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) =>
  new Observable((observer: Observer<boolean>) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.msg.error('You can only upload JPG file!');
      observer.complete();
      return;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
      observer.complete();
      return;
    }
    observer.next(isJpgOrPng && isLt2M);
    observer.complete();
  });
private getBase64(img: File, callback: (img: string) => void): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result!.toString()));
  reader.readAsDataURL(img);
}
phoBelong = (dataItem: planList) => {
  return {
    planId:dataItem.planId,
    operCode: dataItem.operCode,
    blNo:dataItem.blNo,
  };
};
checkphotoupload=(dataItem:planList)=>{
  if (dataItem.planStatus=="S"){
    return true
  }
  else {
    return false
  }
}

handleChange(info: { file: NzUploadFile }): void {
  switch (info.file.status) {
    case 'uploading':
      this.loading = true;
      break;
    case 'done':
      // Get this url from response in real world.
      this.getBase64(info.file!.originFileObj!, (img: string) => {
        this.loading = false;
        console.log(img);
        this.loadDataFromServer(
          this.operCode,
          this.pageIndex,
          this.pageSize,
          this.searchTerm,
          [],
          
          
        );
      });
      break;
    case 'error':
      this.msg.error('Network error');
      this.loading = false;
      break;
  }
}
}
