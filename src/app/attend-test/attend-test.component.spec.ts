import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendTestComponent } from './attend-test.component';

describe('AttendTestComponent', () => {
  let component: AttendTestComponent;
  let fixture: ComponentFixture<AttendTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
