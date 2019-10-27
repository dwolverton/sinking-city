import BoardState from '../BoardState';
import { Action, ActionType } from '../actions';
import { TreasureCard, TREASURE_CARDS, FloodCard, FLOOD_CARDS, TreasureCardSpecial, WATER_LEVELS, TILES, Treasure } from '../boardElements';
import Coord from '../Coord';
import { shuffle } from 'lodash';

export default function applyAction(board: BoardState, action: Action, playerId: number): BoardState {
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
        } else {
            removeTile(tileIndex);
        }
        if (board.floodCardsToDraw === 0) {
            nextPlayer();
        }
    } else if (action.type === ActionType.DrawTreasureCard) {
        const card: TreasureCard = drawTreasureCard();

        if (card.special === TreasureCardSpecial.WATERS_RISE) {
            board = { ...board, 
                waterLevel: board.waterLevel + 1,
                treasureDiscard: push(board.treasureDiscard, card.id),
                floodStack: [ ...board.floodStack, ...shuffle(board.floodDiscard)],
                floodDiscard: []
            };
        } else {
            const player = board.players[playerId];
            board = { ...board,
                players: replace(board.players, playerId, { ...player, cards: push(player.cards, card.id) })
            };
        }

        if (board.treasureCardsToDraw === 0) {
            startDrawFloodCardsPhase();
        }
    } else if (action.type === ActionType.Discard) {
        const player = board.players[playerId];
        board = { ...board,
            players: replace(board.players, playerId,
                { ...player, cards: player.cards.filter(card => card !== action.card) }),
            treasureDiscard: push(board.treasureDiscard, action.card)
        };
    
    } else if (action.type === ActionType.Move) {
        const player = board.players[playerId];

        board = { ...board,
            players: replace(board.players, playerId, { ...player, location: action.location })
        };
        useAction();
    } else if (action.type === ActionType.ShoreUp) {
        const tile = board.tiles[action.location];

        board = { ...board, tiles: replace(board.tiles, action.location, { ...tile, flooded: false })};
        useAction();
    } else if (action.type === ActionType.GiveTreasureCard) {
        const players = board.players.concat();
        let giver = players[playerId];
        let receiver = players[action.player];
        giver = { ...giver, cards: giver.cards.filter(card => card !== action.card)};
        receiver = { ...receiver, cards: [...receiver.cards, action.card]};
        players[playerId] = giver;
        players[action.player] = receiver;

        board = { ...board, players };
        useAction();
    } else if (action.type === ActionType.CaptureTreasure) {
        const player = board.players[playerId];
        const tileId:number = board.tiles[player.location].id;
        const treasure:Treasure = TILES[tileId].treasure;
        const cards = player.cards.filter(card => TREASURE_CARDS[card].treasure === treasure).slice(0, 4);
        board = { ...board,
            players: replace(board.players, playerId,
                { ...player, cards: player.cards.filter(card => !cards.includes(card)) }),
            treasureDiscard: [ ...board.treasureDiscard, ...cards],
            treasuresCaptured: replace(board.treasuresCaptured, treasure.id, true)
        };
        useAction();
    } else if (action.type === ActionType.Done) {
        startDrawTreasureCardsPhase();
    }


    function removeTile(tileLocation:number) {
        board = { ...board,
            tiles: replace(board.tiles, tileLocation, null),
            // it's always the top of the discard pile
            floodDiscard: pop(board.floodDiscard)
        }
    }
    function startDrawTreasureCardsPhase():void {
        board = { ...board, actionsRemaining: 0, treasureCardsToDraw: 2 }
    }

    function startDrawFloodCardsPhase():void {
        board = { ...board, treasureCardsToDraw: 0, floodCardsToDraw: WATER_LEVELS[board.waterLevel] }
    }
    function useAction() {
        if (board.actionsRemaining <= 1) {
            startDrawTreasureCardsPhase();
        } else {
            board = { ...board, actionsRemaining: board.actionsRemaining - 1 };
        }
    }

    function nextPlayer(): void {
        const currentPlayer: number = board.currentPlayer === null ||
            board.currentPlayer >= board.players.length - 1
            ? 0
            : board.currentPlayer + 1;
        board = { ...board, currentPlayer, actionsRemaining: 3 };
    }
    function drawFloodCard(): FloodCard {
        if (board.floodStack.length == 0) {
            board = { ...board,
                floodStack: shuffle(board.floodDiscard),
                floodDiscard: []
            };
        }

        const id = board.floodStack[board.floodStack.length - 1];
        board = {
            ...board,
            floodStack: pop(board.floodStack),
            floodDiscard: push(board.floodDiscard, id),
            floodCardsToDraw: board.floodCardsToDraw - 1
        };
        return FLOOD_CARDS[id];
    }
    function drawTreasureCard(): TreasureCard {
        if (board.treasureStack.length == 0) {
            board = { ...board,
                treasureStack: shuffle(board.treasureDiscard),
                treasureDiscard: []
            };
        }

        const id = board.treasureStack[board.treasureStack.length - 1];
        board = {
            ...board,
            treasureStack: pop(board.treasureStack),
            treasureCardsToDraw: board.treasureCardsToDraw - 1
        };
        return TREASURE_CARDS[id];
    }
    console.log(board);
    return board;
}

function pop<T>(array:T[]):T[] {
    return array.slice(0, array.length - 1);
}

function push<T>(array:T[], item:T):T[] {
    return [ ...array, item]
}

function replace<T>(array:T[], i:number, item:T):T[] {
    return [ ...array.slice(0, i), item, ...array.slice(i + 1)];
}