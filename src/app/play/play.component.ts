import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  board: BoardState;
  actions: AvailableAction[];
  ACTION_NAMES = ACTION_NAMES;
  inProgressAction: AvailableAction = null;

  constructor(private gameManager: GameManagerService, private route: ActivatedRoute) { }

  doAction(action: AvailableAction) {
    if (actionRequiresParams(action)) {
      this.inProgressAction = action;
      return;
    }

    this.gameManager.doAction({ type: action.type });
  }

  selectTile(location:number) {
    const action: AvailableAction = this.inProgressAction;
    if (action && action.locations.includes(location)) {
      this.inProgressAction = null;
      this.gameManager.doAction({ type: action.type, location });
    }
  }

  selectCard(cardId:number) {
    const action: AvailableAction = this.inProgressAction;
    if (action && action.pickCard && this.board.players[this.board.currentPlayer].cards.includes(cardId)) {
      this.inProgressAction = null;
      this.gameManager.doAction({ type: action.type, card: cardId });
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.gameManager.loadGame(+params.get('gameId'));
    });

    this.gameManager.board$.pipe(takeUntil(this.stop$)).subscribe(board => { this.board = board; console.log(board); });
    this.gameManager.actions$.pipe(takeUntil(this.stop$)).subscribe(actions => {
      this.actions = actions;
      this.inProgressAction = null;
    });
  }

  @HostListener("document:keydown.w")
  moveActionShortcut() {
    this.doActionIfAvailable(ActionType.Move);
  }

  @HostListener("document:keydown.s")
  shoreUpActionShortcut() {
    this.doActionIfAvailable(ActionType.ShoreUp);
  }

  @HostListener("document:keydown.d")
  drawActionShortcut() {
    if (this.actions[0].type === ActionType.DrawFloodCard || this.actions[0].type === ActionType.DrawTreasureCard) {
      this.doAction(this.actions[0]);
    }
  }

  @HostListener("document:keydown.x")
  doneActionShortcut() {
    this.doActionIfAvailable(ActionType.Done);
  }

  doActionIfAvailable(type: ActionType) {
    for (const action of this.actions) {
      if (action.type === type) {
        this.doAction(action);
        break;
      }
    }
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.unsubscribe();
  }

  itemId(item) { return item.id; }

}

function actionRequiresParams(action:AvailableAction):boolean {
  return !! (action && (action.locations || action.pickCard || action.players));
}
