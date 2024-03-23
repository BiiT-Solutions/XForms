import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRunnerComponent } from './form-runner.component';

describe('FormRunnerComponent', () => {
  let component: FormRunnerComponent;
  let fixture: ComponentFixture<FormRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRunnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
