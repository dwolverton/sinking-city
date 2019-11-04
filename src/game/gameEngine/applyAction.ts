import BoardState, { Outcome } from '../BoardState';
import { Action, ActionType } from '../actions';
import { TreasureCard, TREASURE_CARDS, FloodCard, FLOOD_CARDS, TreasureCardSpecial, WATER_LEVELS, TILES, Treasure } from '../boardElements';
import Coord from '../Coord';
import { shuffle } from 'lodash';
import { findLocationsForMove } from './getValidActions';

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
        discard(action.card);
    } else if (action.type === ActionType.Move) {
        const player = board.players[playerId];
        const moveFromRemovedTile = board.tiles[player.location] === null;

        board = { ...board,
            players: replace(board.players, playerId, { ...player, location: action.location })
        };
        if (!moveFromRemovedTile) {
            useAction();
        }
    } else if (action.type === ActionType.ShoreUp) {
        const tile = board.tiles[action.location];

        board = { ...board, tiles: replace(board.tiles, action.location, { ...tile, flooded: false })};
        useAction();
    } else if (action.type === ActionType.Sandbags) {
        const tile = board.tiles[action.location];
        const cardId = board.players[playerId].cards.find(cardId => TREASURE_CARDS[cardId].special === TreasureCardSpecial.SANDBAGS);

        board = { ...board, tiles: replace(board.tiles, action.location, { ...tile, flooded: false })};
        discard(cardId);
    } else if (action.type === ActionType.HelicopterLift) {
        const players = board.players.map(p => action.players.includes(p.id) ? {
            ...p, location: action.location
        } : p);
        board = { ...board, players }

        const cardId = board.players[playerId].cards.find(cardId => TREASURE_CARDS[cardId].special === TreasureCardSpecial.HELICOPTER_LIFT);
        discard(cardId);
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
    } else if (action.type === ActionType.Win) {
        return { ...board, outcome: Outcome.WIN };
    }

    if (isLoss()) {
        board = { ...board, outcome: Outcome.LOSE };
    }
    return board;

    function discard(cardId:number) {
        const player = board.players[playerId];
        board = { ...board,
            players: replace(board.players, playerId,
                { ...player, cards: player.cards.filter(card => card !== cardId) }),
            treasureDiscard: push(board.treasureDiscard, cardId)
        };
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

    function isLoss():boolean {
        // water level too high
        if (board.waterLevel >= 9) {
            return true;
        }
        // exit tile is sunk (0 is exit)
        if (!board.tiles.some(card => card && card.id === 0)) {
            return true;
        }
        // all of a necessary treasure tile are sunk
        for (let i = 0; i < 4; i++) {
            if (!board.treasuresCaptured[i]) {
                // 2 tiles for each treasure
                const cardA = i * 2 + 1;
                const cardB = i * 2 + 2;
                if (!board.tiles.some(card => card && (card.id === cardA || card.id === cardB))) {
                    return true;
                }
            }
        }
        // player in water and can't move
        for (const player of board.players) {
            if (board.tiles[player.location] === null && findLocationsForMove(board, player).length === 0) {
                return true;
            }
        }
        return false;
    }
}

function pop<T>(array:T[]):T[] {
    return array.slice(0, array.length - 1);
}

function push<T>(array:T[], item:T):T[] {
    return [ ...array, item]
}

function removeIndex<T>(array:T[], i:number):T[] {
    return [ ...array.slice(0, 1), ...array.slice(i + 1)];
}

function replace<T>(array:T[], i:number, item:T):T[] {
    return [ ...array.slice(0, i), item, ...array.slice(i + 1)];
}