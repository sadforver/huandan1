import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { loginUrl, testUrl } from '../base-urls';
import { accessTokenKey, refreshTokenKey } from '../models/constant';
import { Result } from '../models/result';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }


  login(userInfo: any) {
    return this.http.post<Result<any>>(loginUrl, userInfo);
  }

  logout() {
    this.localStorageService.removeItem(accessTokenKey);
    this.localStorageService.removeItem(refreshTokenKey);
    this.router.navigate(['/index/login']);
  }


  test() {
    const p = 'a';
    return this.http.post<Result<any>>(testUrl, { p });
  }

}
