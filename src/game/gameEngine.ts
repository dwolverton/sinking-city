import BoardState, { TileState, PlayerState } from './BoardState';
import { Action, AvailableAction, ActionType } from './actions';
import Coord, { ICoord, MAX_COORD } from './Coord';
export { default as getInitialBoard } from './gameEngine/getInitialBoard';
export { default as applyAction } from './gameEngine/applyAction';

export function isValidAction(board:BoardState, action:Action, player:number):boolean {
    return getValidActions(board, player).some(availableAction => availableAction.type === action.type);
}

export function getValidActions(board:BoardState, playerNum:number):AvailableAction[] {
    let actions:AvailableAction[] = [];

    if (board.floodCardsToDraw) {
        if (board.currentPlayer === null || board.currentPlayer === playerNum) {
            actions.push({type: ActionType.DrawFloodCard });
        }
    } else if (board.treasureCardsToDraw) {
        if (board.currentPlayer === playerNum) {
            actions.push({type: ActionType.DrawTreasureCard });
        }
    } else {
        // current player only
        if (board.currentPlayer === playerNum && board.actionsRemaining !== 0) {
            const playerState:PlayerState = board.players[playerNum];
            addMoveAction(playerState);
            addShoreUpAction(playerState);
            actions.push({type: ActionType.GiveTreasureCard });
            actions.push({type: ActionType.CaptureTreasure });
            actions.push({type: ActionType.Done });
        }

        // all players
    }

    function addMoveAction(playerState:PlayerState) {
        const tiles:number[] = filterToValidTiles(getAdjacentSpaces(playerState, false, false), board.tiles);
        if (tiles.length !== 0) {
            actions.push({type: ActionType.Move, tiles });
        }
    }

    function addShoreUpAction(playerState:PlayerState) {
        const tiles:number[] = filterToFloodedTiles(getAdjacentSpaces(playerState, true, false), board.tiles);
        if (tiles.length !== 0) {
            actions.push({type: ActionType.ShoreUp, tiles });
        }
    }

    return actions;
}

function getAdjacentSpaces(coord:ICoord, self:boolean, diagonal:boolean):Coord[] {
    let spaces:Coord[] = [
        new Coord(coord.x, coord.y - 1),
        new Coord(coord.x - 1, coord.y),
        new Coord(coord.x + 1, coord.y),
        new Coord(coord.x, coord.y + 1)
    ];
    if (self) {
        spaces.unshift(Coord.fromCoord(coord));
    }
    if (diagonal) {
        spaces.push(new Coord(coord.x - 1, coord.y - 1));
        spaces.push(new Coord(coord.x + 1, coord.y - 1));
        spaces.push(new Coord(coord.x - 1, coord.y + 1));
        spaces.push(new Coord(coord.x + 1, coord.y + 1));
    }
    // filter out out-of-bounds
    spaces = spaces.filter(c => c.x >= 0 && c.y >= 0 && c.x <= MAX_COORD && c.y <= MAX_COORD);
    return spaces;
}

function filterToValidTiles(coords:Coord[], tiles:TileState[]):number[] {
    return coords.map(coord => coord.toIndex()).filter(i => tiles[i] !== null);
}

function filterToFloodedTiles(coords:Coord[], tiles:TileState[]):number[] {
    return filterToValidTiles(coords, tiles).filter(i => tiles[i].flooded);
}