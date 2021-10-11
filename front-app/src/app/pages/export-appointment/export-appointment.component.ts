import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SharedService } from 'src/app/shared.service';
import { planList } from './planList';
@Component({
  selector: 'app-export-appointment',
  templateUrl: './export-appointment.component.html',
  styleUrls: ['./export-appointment.component.scss']
})
export class ExportAppointmentComponent implements OnInit {

  constructor(
    private sharedService:SharedService
  ) { }
  userId: string='1';
  plan: planList[]=[];
  searchTerm!: string | null;
  filter!: Array<{ key: string; value: string; }>;
  loading = true;
  total = 1;
  pageIndex = 1;
  pageSize = 10;

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
    console.log(this.plan)
  }

}
