import BoardState, { TileState, PlayerState } from './BoardState';
import { Action, AvailableAction, ActionType } from './actions';
import Coord, { ICoord, MAX_COORD } from './Coord';
export { default as getInitialBoard } from './gameEngine/getInitialBoard';
export { default as applyAction } from './gameEngine/applyAction';

export function isValidAction(board:BoardState, action:Action, playerId:number):boolean {
    return getValidActions(board, playerId).some(availableAction => availableAction.type === action.type);
}

export function getValidActions(board:BoardState, playerId:number):AvailableAction[] {
    let actions:AvailableAction[] = [];
    let includeDone:boolean = false;

    if (board.players.some(p => p.cards.length > 5)) {
        // if any player has too many cards, they must discard before any player can take any action
        if (board.players[playerId].cards.length > 5) {
            actions.push({ type: ActionType.Discard, pickCard: true });
        }
        return actions;
    } else if (board.floodCardsToDraw) {
        if (board.currentPlayer === null || board.currentPlayer === playerId) {
            actions.push({type: ActionType.DrawFloodCard });
        }
    } else if (board.treasureCardsToDraw) {
        if (board.currentPlayer === playerId) {
            actions.push({type: ActionType.DrawTreasureCard });
        }
    } else {
        // current player only
        if (board.currentPlayer === playerId && board.actionsRemaining !== 0) {
            const playerState:PlayerState = board.players[playerId];
            addMoveAction(playerState);
            addShoreUpAction(playerState);
            actions.push({type: ActionType.GiveTreasureCard });
            actions.push({type: ActionType.CaptureTreasure });
            includeDone = true;
        }

        // all players
    }

    if (board.players[playerId].cards.length !== 0) {
        actions.push({ type: ActionType.Discard, pickCard: true });
    }

    if (includeDone) {
        // doing this here ensures that done is always the last action in order.
        actions.push({type: ActionType.Done });
    }


    function addMoveAction(playerState:PlayerState) {
        const locations:number[] = filterToValidTiles(getAdjacentSpaces(playerState.location, false, false), board.tiles);
        if (locations.length !== 0) {
            actions.push({type: ActionType.Move, locations });
        }
    }

    function addShoreUpAction(playerState:PlayerState) {
        const locations:number[] = filterToFloodedTiles(getAdjacentSpaces(playerState.location, true, false), board.tiles);
        if (locations.length !== 0) {
            actions.push({type: ActionType.ShoreUp, locations });
        }
    }

    return actions;
}

function getAdjacentSpaces(location:number, self:boolean, diagonal:boolean):Coord[] {
    const coord:ICoord = Coord.fromIndex(location);
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