import { TREASURE_CARDS, FLOOD_CARDS, ROLES, TreasureCard, TreasureCardSpecial } from '../boardElements';
import BoardState, { TileState, Outcome } from '../BoardState';
import { createShuffledNumbersArray } from '../utils';
import GameMetadata, { PlayerMetadata } from '../GameMetadata';

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
    const spaces:TileState[] = [];
    // block off empty tiles
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
    return spaces;
}