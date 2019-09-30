import BoardState from '../BoardState';
import { Action, ActionType } from '../actions';
import { TreasureCard, TREASURE_CARDS, FloodCard, FLOOD_CARDS, TreasureCardSpecial, WATER_LEVELS } from '../boardElements';

export default function applyAction(board: BoardState, action: Action, player: number): BoardState {
    if (action.type === ActionType.DrawFloodCard) {
        const card: FloodCard = drawFloodCard();
        const tileIndex = board.tiles.findIndex(tile => tile && (tile.id === card.tile.id));
        if (!board.tiles[tileIndex].flooded) {
            board = {
                ...board, tiles: [
                    ...board.tiles.slice(0, tileIndex),
                    { ...board.tiles[tileIndex], flooded: true },
                    ...board.tiles.slice(tileIndex + 1)
                ]
            };
        }
        else {
            // TODO remove tile and card
        }
        if (board.floodCardsToDraw === 0) {
            nextPlayer();
        }
    } else if (action.type === ActionType.DrawTreasureCard) {
        const card: TreasureCard = drawTreasureCard();
        const player = board.players[board.currentPlayer];

        board = { ...board, players: [
            ...board.players.slice(0, board.currentPlayer),
            { ... player, cards: [ ...player.cards, card.id ] },
            ...board.players.slice(board.currentPlayer + 1)
        ]};

        if (board.treasureCardsToDraw === 0) {
            startDrawFloodCardsPhase();
        }
    } else if (action.type === ActionType.Done) {
        startDrawTreasureCardsPhase();
    }



    function startDrawTreasureCardsPhase():void {
        board = { ...board, actionsRemaining: 0, treasureCardsToDraw: 2 }
    }

    function startDrawFloodCardsPhase():void {
        board = { ...board, treasureCardsToDraw: 0, floodCardsToDraw: WATER_LEVELS[board.waterLevel] }
    }

    function nextPlayer(): void {
        const currentPlayer: number = board.currentPlayer === null ||
            board.currentPlayer >= board.players.length - 1
            ? 0
            : board.currentPlayer + 1;
        board = { ...board, currentPlayer, actionsRemaining: 3 };
    }
    function drawFloodCard(): FloodCard {
        // TODO if deck is empty, shuffle discard pile and replace.
        const id = board.floodStack[board.floodStack.length - 1];
        board = {
            ...board,
            floodStack: board.floodStack.slice(0, board.floodStack.length - 1),
            floodDiscard: [...board.floodDiscard, id],
            floodCardsToDraw: board.floodCardsToDraw - 1
        };
        return FLOOD_CARDS[id];
    }
    function drawTreasureCard(): TreasureCard {
        // TODO if deck is empty, shuffle discard pile and replace.
        const id = board.treasureStack[board.treasureStack.length - 1];
        board = {
            ...board,
            treasureStack: board.treasureStack.slice(0, board.treasureStack.length - 1),
            treasureCardsToDraw: board.treasureCardsToDraw - 1
        };
        return TREASURE_CARDS[id];
    }
    console.log(board);
    return board;
}
