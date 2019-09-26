import BoardState from './BoardState';
import { Action, ActionDef, DrawFloodCardAction, DrawTreasureCardAction, MoveAction, ShoreUpAction, GiveTreasureCardAction, CaptureTreasureAction, DoneAction } from './actions';
export { default as getInitialBoard } from './gameEngine/getInitialBoard';
export { default as applyAction } from './gameEngine/applyAction';

export function isValidAction(board:BoardState, action:Action, player:number):boolean {
    return getValidActions(board, player).some(Def => action instanceof (<any>Def));
}

export function getValidActions(board:BoardState, player:number):ActionDef[] {
    let actions = [];

    if (board.floodCardsToDraw) {
        if (board.currentPlayer === null || board.currentPlayer === player) {
            actions.push(DrawFloodCardAction);
        }
    } else if (board.treasureCardsToDraw) {
        if (board.currentPlayer === player) {
            actions.push(DrawTreasureCardAction);
        }
    } else {
        // current player only
        if (board.currentPlayer === player && board.actionsRemaining !== 0) {
            actions.push(MoveAction);
            actions.push(ShoreUpAction);
            actions.push(GiveTreasureCardAction);
            actions.push(CaptureTreasureAction);
            actions.push(DoneAction);
        }

        // all players
    }

    return actions;
}