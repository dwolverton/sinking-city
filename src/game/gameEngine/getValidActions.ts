import BoardState, { TileState, PlayerState, Outcome } from '../BoardState';
import { Action, AvailableAction, ActionType, ACTION_ORDER } from '../actions';
import Coord, { ICoord, MAX_COORD } from '../Coord';
import { TILES, TREASURE_CARDS, Tile, TreasureCardSpecial } from '../boardElements';

export default function getValidActions(board:BoardState):AvailableAction[][] {
    const actions:AvailableAction[][] = board.players.map(() => []);
    let disallowOtherActions = false;
    if (board.outcome !== Outcome.NONE) {
        return actions;
    }

    if (board.floodCardsToDraw && board.currentPlayer === null) {
        // at beginning of game, anyone can draw the initial cards
        const action = {type: ActionType.DrawFloodCard };
        for (let player of board.players) {
            actions[player.id].push(action);
        }
        return actions;
    }
    
    for (let player of board.players) {
        if (board.tiles[player.location] == null) {
            addMoveAction(board, player, actions[player.id]);
            disallowOtherActions = true;
        }
    }
    if (disallowOtherActions) {
        return actions;
    }

    for (let player of board.players) {
        if (player.cards.length > 0) {
            if (player.cards.some(card => TREASURE_CARDS[card].special === TreasureCardSpecial.SANDBAGS)) {
                actions[player.id].push({ type: ActionType.Sandbags, locations: findAllFloodedLocations(board) });
            }
            if (player.cards.some(card => TREASURE_CARDS[card].special === TreasureCardSpecial.HELICOPTER_LIFT)) {
                actions[player.id].push({ type: ActionType.HelicopterLift });
                if (isWin()) {
                    actions[player.id].push({ type: ActionType.Win });
                }
            }
            actions[player.id].push({ type: ActionType.Discard, pickCard: true });
            if (player.cards.length > 5) {
                disallowOtherActions = true;
            }
        }
    }
    if (disallowOtherActions) {
        return actions;
    }

    addValidActionsForCurrentPlayer(board, board.players[board.currentPlayer], actions[board.currentPlayer]);

    for (const acts of actions) {
        acts.sort(actionSort);
    }

    return actions;

    function isWin() {
        return board.treasuresCaptured.every(captured => captured) &&
        board.players.every(player => {
            const tile = board.tiles[player.location];
            return tile && tile.id === 0;
        });
    }
}

function addValidActionsForCurrentPlayer(board:BoardState, playerState:PlayerState, actions:AvailableAction[]):void {
    if (board.floodCardsToDraw) {
        actions.push({type: ActionType.DrawFloodCard });
    } else if (board.treasureCardsToDraw) {
        actions.push({type: ActionType.DrawTreasureCard });
    } else {
        addMoveAction(board, playerState, actions);
        addShoreUpAction();
        addGiveTreasureCardAction();
        addCaptureTreasureAction();
        actions.push({type: ActionType.Done });
    }

    function addShoreUpAction() {
        const locations:number[] = filterToFloodedTiles(getAdjacentSpaces(playerState.location, true, false), board.tiles);
        if (locations.length !== 0) {
            actions.push({type: ActionType.ShoreUp, locations });
        }
    }

    function addGiveTreasureCardAction() {
        if (playerState.cards.length === 0) {
            return;
        }
        let colocatedPlayers:number[] = board.players
            .filter(player => player.id !== playerState.id && player.location === playerState.location)
            .map(player => player.id);
        if (colocatedPlayers.length !== 0) {
            actions.push({type: ActionType.GiveTreasureCard, players: colocatedPlayers, pickCard: true });
        }
    }

    function addCaptureTreasureAction() {
        const tile:Tile = getTileAtLocation(playerState.location);
        if (tile && tile.treasure) {
            if (board.treasuresCaptured[tile.treasure.id]) {
                return; // already captured
            }
            const cardCount = playerState.cards.reduce((count:number, cardId:number) => 
                TREASURE_CARDS[cardId].treasure === tile.treasure ? count + 1 : count,
                0
            )
            if (cardCount >= 4) {
                actions.push({type: ActionType.CaptureTreasure });
            }
        }
    }

    function getTileAtLocation(location:number):Tile {
        const tileState:TileState = board.tiles[location];
        if (tileState === null) {
            return null;
        }
        return TILES[tileState.id];
    }
}

function addMoveAction(board:BoardState, playerState:PlayerState, actions:AvailableAction[]) {
    const locations:number[] = findLocationsForMove(board, playerState);
    if (locations.length !== 0) {
        actions.push({type: ActionType.Move, locations });
    }
}

export function findLocationsForMove(board:BoardState, player:PlayerState):number[] {
    return filterToValidTiles(getAdjacentSpaces(player.location, false, false), board.tiles);
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

function actionSort(a:AvailableAction, b:AvailableAction):number {
    return ACTION_ORDER[a.type] - ACTION_ORDER[b.type];
}

function findAllFloodedLocations(board:BoardState) {
    return board.tiles.map((tile, loc) => tile && tile.flooded ? loc : null).filter(loc => loc !== null);
}