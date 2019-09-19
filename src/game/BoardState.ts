export default interface BoardState {
    players:PlayerState[];
    currentPlayer:number;
    actionsRemaining:number;
    tiles:TileState[];
    waterLevel:number;
    treasureStack:number[];
    treasureDiscard:number[];
    floodStack:number[];
    floodDiscard:number[];
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

