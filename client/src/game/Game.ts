import BoardState from './BoardState';
import GameMetadata from './GameMetadata';

export default interface Game {
    metadata:GameMetadata
    board:BoardState;
}