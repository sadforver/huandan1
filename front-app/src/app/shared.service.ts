import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { planList } from './pages/export-appointment/planList'; 
import { checkres, Result } from './result';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}
  getStudent(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    searchTerm: string | null,
    filters: Array<{ key: string; value: string }>
  ): Observable<Result<planList[]>> {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`)
      .append('searchTerm', `${searchTerm}`);
    filters.forEach((filter) => {
      if (filter.value) {
        params = params.append(filter.key, filter.value);
      }
    });
    return this.http
      .get<Result<planList[]>>(`${this.apiUrl + /takecontainerplan/}`, { params })
      .pipe(catchError(() => of(null)));
  }
  addStudent(val: any): Observable<Result<planList>> {
    return this.http.post<Result<planList>>(this.apiUrl + '/stud/', val);
  }
  updateStudent(val: any): Observable<Result<planList>> {
    return this.http.put<Result<planList>>(this.apiUrl + '/stud/', val);
  }
  deleteStudent(val: any) {
    return this.http.delete(this.apiUrl + '/stud/', {
      params: {
        studentId: val,
      },
    });
  }
}