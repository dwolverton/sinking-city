import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameManagerService } from '../game-manager.service';
import BoardState from 'src/game/BoardState';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy {

  private stop$ = new Subject();
  board:BoardState;

  constructor(private gameManager:GameManagerService) { }

  ngOnInit() {
    this.gameManager.board$.pipe(takeUntil(this.stop$)).subscribe(board => this.board = board);
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.unsubscribe();
  }

}
