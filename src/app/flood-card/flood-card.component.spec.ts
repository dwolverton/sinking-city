import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloodCardComponent } from './flood-card.component';

describe('FloodCardComponent', () => {
  let component: FloodCardComponent;
  let fixture: ComponentFixture<FloodCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloodCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
