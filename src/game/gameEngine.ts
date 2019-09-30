import BoardState from './BoardState';
import { Action, AvailableAction, ActionType } from './actions';
export { default as getInitialBoard } from './gameEngine/getInitialBoard';
export { default as applyAction } from './gameEngine/applyAction';

export function isValidAction(board:BoardState, action:Action, player:number):boolean {
    return getValidActions(board, player).some(availableAction => availableAction.type === action.type);
}

export function getValidActions(board:BoardState, player:number):AvailableAction[] {
    let actions:AvailableAction[] = [];

    if (board.floodCardsToDraw) {
        if (board.currentPlayer === null || board.currentPlayer === player) {
            actions.push({type: ActionType.DrawFloodCard });
        }
    } else if (board.treasureCardsToDraw) {
        if (board.currentPlayer === player) {
            actions.push({type: ActionType.DrawTreasureCard });
        }
    } else {
        // current player only
        if (board.currentPlayer === player && board.actionsRemaining !== 0) {
            actions.push({type: ActionType.Move });
            actions.push({type: ActionType.ShoreUp });
            actions.push({type: ActionType.GiveTreasureCard });
            actions.push({type: ActionType.CaptureTreasure });
            actions.push({type: ActionType.Done });
        }

        // all players
    }

    return actions;
}