import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  public validateForm: FormGroup;
  public addContainer(): void {
    this.containerContent.push(
      this.fb.group({
        containerId: [null, [Validators.required]],
        containerNo: [null, [Validators.required]],
        enterTime:[null, [Validators.required]],
        ctnNetWeight:[null, [Validators.required]],
        
      })
    );
  }
  public removeContainer(containerIndex: number): void {
    this.containerContent.removeAt(containerIndex);
  }
  get containerContent(): FormArray {
    return this.validateForm.get('containerContent') as FormArray;
  }
  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      ctnSize: [null, [Validators.required]],
      ctnType: [null, [Validators.required]],
      planId: [null, [Validators.required]],
      vessel:[null, [Validators.required]],
      voyage:[null, [Validators.required]],
      billNo:[null, [Validators.required]],
      remark:[null, [Validators.required]],
      containerContent: this.fb.array([
        this.fb.group({
          containerId: [null, [Validators.required]],
          containerNo: [null, [Validators.required]],
          enterTime:[null, [Validators.required]],
          ctnNetWeight:[null, [Validators.required]],

          
        }),
      ]),
    });
  }

  ngOnInit() {}
}
