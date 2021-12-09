import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Result } from 'src/app/result';
import { SharedService } from 'src/app/shared.service';
import { planList } from '../export-appointment/planList';

@Component({
  selector: 'app-bill-upload',
  templateUrl: './bill-upload.component.html',
  styleUrls: ['./bill-upload.component.scss']
})

export class BillUploadComponent implements OnInit {
  constructor(
    private sharedService:SharedService,
    private modal: NzModalService,
    // private msg: NzMessageService
  ) { }
  operCode: string='1';
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

}
