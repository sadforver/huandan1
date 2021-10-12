import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable,Observer,Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Result } from 'src/app/result';
import { SharedService } from 'src/app/shared.service';
import { ModalComponent } from './modal/modal.component';
import { planList } from './planList';
@Component({
  selector: 'app-export-appointment',
  templateUrl: './export-appointment.component.html',
  styleUrls: ['./export-appointment.component.scss']
})
export class ExportAppointmentComponent implements OnInit {

  constructor(
    private sharedService:SharedService,
    private modal: NzModalService,
    // private msg: NzMessageService
  ) { }
  userId: string='1';
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
    userId:string,
    pageIndex: number,
    pageSize: number,
    searchTerm: string | null,
    filter: Array<{ key: string; value: string }>
  ): void {
    this.loading = true;
    this.sharedService
      .getPlan(userId,pageIndex, pageSize, searchTerm, filter)
      .subscribe({
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
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex,  filter } = params;
    const searchTerm = this.searchTerm || null;
    const userId=this.userId;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.searchTerm = searchTerm;
    this.filter = filter;
    this.loadDataFromServer(
      userId,
      pageIndex,
      pageSize,
      searchTerm,
      filter
    );
  }
  ngOnInit(): void {
    this.loadDataFromServer(
      this.userId,
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
          this.userId,
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
      this.userId,
      this.pageIndex,
      this.pageSize,
      this.searchTerm,
      this.filter,
    );
  }
  resetFilters(){
    this.filter=[]
    this.loadDataFromServer(
      this.userId,
      this.pageIndex,
      this.pageSize,
      this.searchTerm,
      this.filter,
    );
  }
  creatForm(): void {
    const modal = this.modal.create({
      nzTitle: 'Add New Student',
      nzContent: ModalComponent,
      nzComponentParams: {
        dataItem: {
          studentId: '',
          studentName: '',
          gender: 'F',
          schoolYear: new Date(),
          telephone: '',
          email: '',
          studentType: 'M',
          idNo: '',
          avatarUrl: '',
        },
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
          this.userId,
          this.pageIndex,
          this.pageSize,
          this.searchTerm,
          []
        );
      }
    });
  }
}
