import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseGroupAndChannelComponent } from './choose-group-and-channel.component';

describe('ChooseGroupAndChannelComponent', () => {
  let component: ChooseGroupAndChannelComponent;
  let fixture: ComponentFixture<ChooseGroupAndChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseGroupAndChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseGroupAndChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
