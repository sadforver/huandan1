import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAppointmentComponent } from './export-appointment.component';

describe('ExportAppointmentComponent', () => {
  let component: ExportAppointmentComponent;
  let fixture: ComponentFixture<ExportAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
