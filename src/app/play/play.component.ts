import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameManagerService } from '../game-manager.service';
import BoardState from 'src/game/BoardState';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvailableAction, Action, ActionType, ACTION_NAMES } from 'src/game/actions';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {

  private stop$ = new Subject();
  board:BoardState;
  actions:AvailableAction[];
  ACTION_NAMES = ACTION_NAMES;

  constructor(private gameManager:GameManagerService) { }

  doAction(availableAction:AvailableAction) {
    this.gameManager.doAction({type: availableAction.type});
  }

  ngOnInit() {
    this.gameManager.board$.pipe(takeUntil(this.stop$)).subscribe(board => this.board = board);
    this.gameManager.actions$.pipe(takeUntil(this.stop$)).subscribe(actions => this.actions = actions);
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.unsubscribe();
  }

}
