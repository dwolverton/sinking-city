import { TREASURE_CARDS, FLOOD_CARDS, ROLES, TreasureCard, TreasureCardSpecial, FloodCard } from '../boardElements';
import BoardState, { TileState } from '../BoardState';
import shuffle from 'lodash/shuffle';
import Coord from '../Coord';

// Difficulties: 0=Novice, 1=Normal, 2=Elite, 3=Legendary
export default function getInitialBoard(playerCount:number, difficulty:number):BoardState {
    const board:BoardState = {
        players: [],
        tiles: createTiles(),
        currentPlayer: null,
        actionsRemaining: null,
        waterLevel: difficulty,
        treasureStack: createShuffledNumbersArray(TREASURE_CARDS.length),
        treasureDiscard: [],
        treasureCardsToDraw: 0,
        floodStack: createShuffledNumbersArray(FLOOD_CARDS.length),
        floodDiscard: [],
        floodCardsToDraw: 6,
        startupComplete: false
    };
    addPlayers(board, playerCount);

    // Temp
    // for (let i = 0; i < 5; i++) {
    //     board.players[0].cards.push(drawNonWatersRiseTreasureCard(board).id);
    // }
    // board.currentPlayer = 1;
    // board.tiles[7].flooded = true;
    // board.treasureDiscard.push(drawTreasureCard(board).id);
    // board.floodDiscard.push(drawFloodCard(board).id);

    return board;
}

function addPlayers(board:BoardState, playerCount:number):void {
    const roles = createShuffledNumbersArray(ROLES.length);

    for (let i = 0; i < playerCount; i++) {
        const player:any = {
            id: i,
            name: "Player " + (i + 1),
            role: roles.pop(),
            cards: [drawNonWatersRiseTreasureCard(board).id, drawNonWatersRiseTreasureCard(board).id]
        };
        const startingTile = ROLES[player.role].startingTile;
        const startingTileIndex = board.tiles.findIndex(tile => tile && tile.id === startingTile);
        const startingTileCoord = Coord.fromIndex(startingTileIndex);
        player.x = startingTileCoord.x;
        player.y = startingTileCoord.y;
        board.players.push(player);
    }
}

function drawTreasureCard(board:BoardState):TreasureCard {
    const id = board.treasureStack.pop();
    return TREASURE_CARDS[id];
}

function replaceTreasureCard(board:BoardState, id:number):void {
    const pos = Math.floor(Math.random() * (board.treasureStack.length + 1));
    board.treasureStack.splice(pos, 0, id);
}

function drawNonWatersRiseTreasureCard(board:BoardState):TreasureCard {
    let card = drawTreasureCard(board);
    while (card.special == TreasureCardSpecial.WATERS_RISE) {
        replaceTreasureCard(board, card.id);
        card = drawTreasureCard(board);
    }
    return card;
}

function createTiles():TileState[] {
    const spaces:TileState[] = [];
    // block of empty tiles
    spaces[0] = null;
    spaces[1] = null;
    spaces[4] = null;
    spaces[5] = null;
    spaces[6] = null;
    spaces[11] = null;
    spaces[24] = null;
    spaces[29] = null;
    spaces[30] = null;
    spaces[31] = null;
    spaces[34] = null;
    spaces[35] = null;

    const tiles = createShuffledNumbersArray(24);
    for (let i = 2; i < 34; i++) {
        if (spaces[i] === undefined) {
            spaces[i] = { id: tiles.pop(), flooded: false };
        }
    }
    return spaces;
}

function createShuffledNumbersArray(count:number):number[] {
    let arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(i);
    }
    arr = shuffle(arr);
    return arr;
}