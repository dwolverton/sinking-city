export default interface BoardState {
    players:PlayerState[];
    currentPlayer:number;
    actionsRemaining:number;
    tiles:TileState[];
    waterLevel:number;
    treasureStack:number[];
    treasureDiscard:number[];
    treasureCardsToDraw:number;
    floodStack:number[];
    floodDiscard:number[];
    floodCardsToDraw:number;
    outcome:Outcome;
    treasuresCaptured:boolean[];
    undo:BoardState;
}

export interface PlayerState {
    readonly id:number;
    readonly role:number;
    name:string;
    location:number;
    cards:number[];
    /*
     * Pilot - is fly used yet this turn
     */
    special?:any;
}

export interface TileState {
    readonly id:number,
    flooded:boolean
}

export enum Outcome {
    NONE = 0,
    LOSE = 1,
    WIN = 2
}

