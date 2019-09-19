import BoardState from './BoardState';
import { Action } from './actions';
export { default as getInitialBoard } from './gameEngine/getInitialBoard';

export function isValidAction(board:BoardState, action:Action) {

}

export function applyAction(board:BoardState, action:Action):BoardState {
    return board;
}

export function getValidActions(board:BoardState, player:number):[] {
    return [];
}