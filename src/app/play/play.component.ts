import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameManagerService } from '../game-manager.service';
import BoardState, { Outcome } from 'src/game/BoardState';
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
  actions: AvailableAction[][];
  inProgressAction: AvailableAction = null;
  inProgressSelection: { location?:number, players:number[], card?:number } = null;
  inProgressActionPlayerId:number = null;
  highlightPlayers:number[] = null;

  constructor(private gameManager: GameManagerService, private route: ActivatedRoute) { }

  doAction(action:AvailableAction, playerId:number) {
    if (actionRequiresParams(action)) {
      this.inProgressAction = action;
      this.inProgressSelection = { players: [] };
      this.inProgressActionPlayerId = playerId;
      if (action.players) {
        this.highlightPlayers = action.players;
      } else if (action.playerCombos) {
        // initially all players are possible
        this.highlightPlayers = action.playerCombos.map((_, i) => i);
      }
      return;
    }

    this.gameManager.doAction({ type: action.type }, playerId);
  }

  selectTile(location:number) {
    const action: AvailableAction = this.inProgressAction;
    if (action && action.locations.includes(location)) {
      this.inProgressSelection.location = location;
      this.finishInProgressActionIfSatisfied();
    }
  }

  selectCard(cardId:number) {
    const action: AvailableAction = this.inProgressAction;
    if (action && action.pickCard && this.board.players[this.inProgressActionPlayerId].cards.includes(cardId)) {
      this.inProgressSelection.card = cardId;
      this.finishInProgressActionIfSatisfied();
    }
  }

  selectPlayer(playerId:number) {
    const action: AvailableAction = this.inProgressAction;
    if (action && action.players && action.players.includes(playerId)) {
      this.inProgressSelection.players = [ playerId ];
      this.finishInProgressActionIfSatisfied();
    } else if (action && action.playerCombos && this.highlightPlayers.includes(playerId)) {
      let i = this.inProgressSelection.players.indexOf(playerId);
      // toggle player selection
      if (i === -1) {
        this.inProgressSelection.players.push(playerId);
      } else {
        this.inProgressSelection.players.splice(i, 1);
        if (this.inProgressSelection.players.length === 0) {
          // return to all if unselected
          this.highlightPlayers = action.playerCombos.map((_, i) => i);
        }
      }
      if (this.inProgressSelection.players.length == 1) {
        // after first pick, highlight valid combos
        this.highlightPlayers = action.playerCombos[playerId];
      }
    }
  }

  finishInProgressActionIfSatisfied() {
    if (this.isInProgressActionSatisfied()) {
      this.finishInProgressAction();
    }
  }

  isInProgressActionSatisfied() {
    if (this.inProgressAction.locations && this.inProgressSelection.location === undefined) {
      return false;
    }
    if (this.inProgressAction.players && this.inProgressSelection.players.length !== 1) {
      return false;
    }
    if (this.inProgressAction.playerCombos && this.inProgressSelection.players.length === 0) {
      return false;
    }
    if (this.inProgressAction.pickCard && this.inProgressSelection.card === undefined) {
      return false;
    }
    return true;
  }

  finishInProgressAction() {
    const action: AvailableAction = this.inProgressAction;
    const selection:any = this.inProgressSelection;
    const playerId = this.inProgressActionPlayerId;
    this.inProgressAction = null;
    this.inProgressSelection = null;
    this.inProgressActionPlayerId = null;
    this.highlightPlayers = null;
    if (action.players) {
      // for single-player-selection actions, use single player, not array
      selection.player = selection.players[0];
      delete selection.players;
    }

    this.gameManager.doAction({ type: action.type, ...selection }, playerId);
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
    const playerId = this.board.currentPlayer;
    if (playerId !== null && (this.actions[playerId][0].type === ActionType.DrawFloodCard || this.actions[playerId][0].type === ActionType.DrawTreasureCard)) {
      this.doAction(this.actions[playerId][0], playerId);
    } else if (playerId === null && this.actions[0][0].type === ActionType.DrawFloodCard) {
      // doesn't really matter who draws the flood card.
      this.doAction(this.actions[0][0], 0);
    }
  }

  @HostListener("document:keydown.x")
  doneActionShortcut() {
    this.doActionIfAvailable(ActionType.Done);
  }

  doActionIfAvailable(type: ActionType, playerId:number = this.board.currentPlayer) {
    if (playerId !== null) {
      for (const action of this.actions[playerId]) {
        if (action.type === type) {
          this.doAction(action, playerId);
          break;
        }
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
