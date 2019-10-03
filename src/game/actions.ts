export interface AvailableAction {
    type:ActionType;
    locations?:number[];
    cards?:number[];
    players?:number[];
}

export interface Action {
    type:ActionType;
    location?:number;
    card?:number;
    player?:number;
}

export enum ActionType {
    DrawTreasureCard = "DrawTreasureCard",
    DrawFloodCard = "DrawFloodCard",
    Move = "Move",
    ShoreUp = "ShoreUp",
    GiveTreasureCard = "GiveTreasureCard",
    CaptureTreasure = "CaptureTreasure",
    Discard = "Discard",
    Done = "Done"
}

export const ACTION_NAMES = {
    DrawTreasureCard: "Draw Treasure Card",
    DrawFloodCard: "Draw Flood Card",
    Move: "Move",
    ShoreUp: "Shore Up",
    GiveTreasureCard: "Give a Treasure Card",
    CaptureTreasure: "Capture Treasure",
    Discard: "Discard",
    Done: "Done"
}