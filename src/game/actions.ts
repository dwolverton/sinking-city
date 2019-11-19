export interface AvailableAction {
    type:ActionType;
    locations?:number[];
    pickCard?:boolean;
    players?:number[];
    playerCombos?:number[][];
}

export interface Action {
    type:ActionType;
    location?:number;
    card?:number;
    player?:number;
    players?:number[];
}

export enum ActionType {
    Win = "Win",
    DrawTreasureCard = "DrawTreasureCard",
    DrawFloodCard = "DrawFloodCard",
    Move = "Move",
    ShoreUp = "ShoreUp",
    GiveTreasureCard = "GiveTreasureCard",
    CaptureTreasure = "CaptureTreasure",
    Sandbags = "Sandbags",
    HelicopterLift = "HelicopterLift",
    Discard = "Discard",
    Done = "Done",
    Undo = "Undo"
}

export const ACTION_NAMES = {
    Win: "Lift Your Team to WIN",
    DrawTreasureCard: "Draw Treasure Card",
    DrawFloodCard: "Draw Flood Card",
    Move: "Move",
    ShoreUp: "Shore Up",
    GiveTreasureCard: "Give a Treasure Card",
    CaptureTreasure: "Capture Treasure",
    Sandbags: "Use Sandbags",
    HelicopterLift: "Use Helicopter Lift",
    Discard: "Discard",
    Done: "Done",
    Undo: "Undo"
}

export const ACTION_ORDER = {
    Win: -1,
    DrawTreasureCard: 0,
    DrawFloodCard: 1,
    Move: 2,
    ShoreUp: 3,
    GiveTreasureCard: 4,
    CaptureTreasure: 5,
    Sandbags: 6,
    HelicopterLift: 7,
    Discard: 8,
    Done: 9,
    Undo: 10
}