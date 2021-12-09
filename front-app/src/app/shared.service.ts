import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { kong, plan, planList } from './pages/export-appointment/planList'; 
import { checkres, Result } from './result';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}
  getPlan(
    operCode:string,
    pageIndex: number,
    pageSize: number,
    searchTerm: string | null,
    filters: Array<{ key: string; value: string }>
  ): Observable<Result<planList[]>> {
    let params = new HttpParams()
      .append('operCode',`${operCode}`)
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('searchTerm', `${searchTerm}`);
    filters.forEach((filter) => {
      if (filter.value) {
        params = params.append(filter.key, filter.value);
      }
    });
    return this.http
      .get<Result<planList[]>>(`${this.apiUrl + /takecontainerplan/}`, { params })
  }
  getPlan2Verify(
    operCode:string,
    pageIndex: number,
    pageSize: number,
  ): Observable<Result<planList[]>> {
    let params = new HttpParams()
      .append('operCode',`${operCode}`)
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
    return this.http
      .get<Result<planList[]>>(`${this.apiUrl + /takecontainerplan2verify/}`, { params })
  }







  addStudent(val: any): Observable<Result<plan>> {
    return this.http.post<Result<plan>>(this.apiUrl + '/takecontainerplan/', val);
  }
  updateStudent(val: any): Observable<Result<plan>> {
    return this.http.put<Result<plan>>(this.apiUrl + '/stud/', val);
  }
  deleteStudent(val: any):Observable<any> {
    return this.http.delete(this.apiUrl + '/stud/', {params: {planId: val,},});
  }
}