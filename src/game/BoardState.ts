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
    startupComplete:boolean;
}

export interface PlayerState {
    readonly id:number;
    readonly role:number;
    name:string;
    x:number;
    y:number;
    cards:number[];
}

export interface TileState {
    readonly id:number,
    flooded:boolean
}

