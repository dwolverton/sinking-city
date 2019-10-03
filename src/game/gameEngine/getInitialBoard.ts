import { TREASURE_CARDS, FLOOD_CARDS, ROLES, TreasureCard, TreasureCardSpecial } from '../boardElements';
import BoardState, { TileState } from '../BoardState';
import shuffle from 'lodash/shuffle';

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
    return board;
}

function addPlayers(board:BoardState, playerCount:number):void {
    const roles = createShuffledNumbersArray(ROLES.length);

    for (let i = 0; i < playerCount; i++) {
        const role = roles.pop();
        const startingTile = ROLES[role].startingTile;
        const location = board.tiles.findIndex(tile => tile && tile.id === startingTile);

        board.players.push({
            id: i,
            name: "Player " + (i + 1),
            role,
            location,
            cards: [drawNonWatersRiseTreasureCard(board).id, drawNonWatersRiseTreasureCard(board).id]
        });
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