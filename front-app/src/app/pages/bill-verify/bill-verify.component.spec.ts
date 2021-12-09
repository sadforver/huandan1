import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillVerifyComponent } from './bill-verify.component';

describe('BillVerifyComponent', () => {
  let component: BillVerifyComponent;
  let fixture: ComponentFixture<BillVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
