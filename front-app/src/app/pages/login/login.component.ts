import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { accessTokenKey, refreshTokenKey } from 'src/app/models/constant';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const userInfo = {
        username: this.validateForm.value.userName,
        password: this.validateForm.value.password
      };
      this.loginService.login(userInfo).subscribe(
        {
          next: res => {
            console.log('next', res);
            this.localStorageService.setItem('username', res.data.username);
            this.localStorageService.setItem(accessTokenKey, res.data.access);
            this.localStorageService.setItem(refreshTokenKey, res.data.refresh);
            this.router.navigateByUrl('export-appointment');
          },
          error: res => {
            console.log('error', res);
          }
        }
      );
    }
  }

  test() {
    this.loginService.test().subscribe(
      {
        next: res => {
          console.log('next', res);
        },
        error: res => {
          console.log('error', res);
        }
      }
    );
  }

}
