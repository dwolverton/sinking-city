import { TREASURE_CARDS, FLOOD_CARDS, ROLES, TreasureCard, TreasureCardSpecial, OUT_OF_BOUNDS_LOCATIONS, BOARD_TILE_COUNT } from '../boardElements';
import BoardState, { TileState, Outcome } from '../BoardState';
import { createShuffledNumbersArray } from '../utils';
import GameMetadata, { PlayerMetadata } from '../GameMetadata';
import { map } from 'lodash';

export default function getInitialBoard(game:GameMetadata):BoardState {
    const board:BoardState = {
        players: [],
        tiles: createTiles(),
        currentPlayer: null,
        actionsRemaining: null,
        waterLevel: game.difficulty,
        treasureStack: createShuffledNumbersArray(TREASURE_CARDS.length),
        treasureDiscard: [],
        treasureCardsToDraw: 0,
        floodStack: createShuffledNumbersArray(FLOOD_CARDS.length),
        floodDiscard: [],
        floodCardsToDraw: 6,
        outcome: Outcome.NONE,
        treasuresCaptured: [ false, false, false, false ],
        undo:null
    };
    addPlayers(board, game.players);
    return board;
}

function addPlayers(board:BoardState, playerMetadata:PlayerMetadata[]):void {
    for (let i = 0; i < playerMetadata.length; i++) {
        let role = playerMetadata[i].role;
        const startingTile = ROLES[role].startingTile;
        const location = board.tiles.findIndex(tile => tile && tile.id === startingTile);

        board.players.push({
            id: i,
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
    const spaces:TileState[] = createBlankMap();

    const tiles = createShuffledNumbersArray(24);
    for (let i = 2; i < 34; i++) {
        if (spaces[i] === undefined) {
            spaces[i] = { id: tiles.pop(), flooded: false };
        }
    }
    return spaces;
}

export function createBlankMap():TileState[] {
    const spaces:TileState[] = new Array(BOARD_TILE_COUNT);
    // block off empty tiles
    OUT_OF_BOUNDS_LOCATIONS.forEach(i => {
        spaces[i] = null;
    });
    return spaces;
}