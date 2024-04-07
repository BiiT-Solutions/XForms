import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiitLoginPageComponent } from './biit-login-page.component';

describe('BiitLoginPageComponent', () => {
  let component: BiitLoginPageComponent;
  let fixture: ComponentFixture<BiitLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiitLoginPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiitLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
