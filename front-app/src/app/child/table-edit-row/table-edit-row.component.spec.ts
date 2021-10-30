import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEditRowComponent } from './table-edit-row.component';

describe('TableEditRowComponent', () => {
  let component: TableEditRowComponent;
  let fixture: ComponentFixture<TableEditRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableEditRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEditRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
