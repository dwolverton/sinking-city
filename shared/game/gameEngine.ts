import BoardState from './BoardState';
import { Action } from './actions';
import { getValidActions } from './gameEngine';
export { default as getInitialBoard } from './gameEngine/getInitialBoard';
export { default as applyAction } from './gameEngine/applyAction';
export { default as getValidActions } from './gameEngine/getValidActions';

export function isValidAction(board:BoardState, action:Action, playerId:number):boolean {
    return getValidActions(board)[playerId].some(availableAction => availableAction.type === action.type);
}