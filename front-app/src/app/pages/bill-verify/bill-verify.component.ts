import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Result } from 'src/app/result';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedService } from 'src/app/shared.service';
import { planList } from '../export-appointment/planList';

@Component({
  selector: 'app-bill-verify',
  templateUrl: './bill-verify.component.html',
  styleUrls: ['./bill-verify.component.scss']
})
export class BillVerifyComponent implements OnInit {
  

  constructor(
    private sharedService:SharedService,
    private localStorageService: LocalStorageService,
  ) { }
  plan:planList[]=[]
  total = 1;
  pageIndex = 1;
  pageSize = 10;
  loading!:boolean
  operCode!:string
  result$!: Observable<Result<planList[]>>;
  private searchTerm$ = new Subject<string | null>();

  ngOnInit(): void {
    this.operCode=this.localStorageService.getItem('username')
    this.loadDataFromServer(
      this.operCode,
      this.pageIndex,
      this.pageSize,
    );
    this.result$ = this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() =>
        this.sharedService.getPlan2Verify(
          this.operCode,
          this.pageIndex,
          this.pageSize,
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
  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex } = params;
    const operCode=this.operCode;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataFromServer(
      operCode,
      pageIndex,
      pageSize,
    );
  }
  loadDataFromServer(
    operCode:string,
    pageIndex: number,
    pageSize: number,

  ): void {
    this.loading = true;
    this.sharedService
      .getPlan2Verify(operCode,pageIndex, pageSize)
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
}
