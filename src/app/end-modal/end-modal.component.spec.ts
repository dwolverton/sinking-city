import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndModalComponent } from './end-modal.component';

describe('EndModalComponent', () => {
  let component: EndModalComponent;
  let fixture: ComponentFixture<EndModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
