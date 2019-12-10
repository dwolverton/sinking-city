export interface AvailableAction {
    type:ActionType;
    locations?:number[];
    cards?:number[];
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
    Fly = "Fly",
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
    Fly: "Fly",
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
    Fly: 3, 
    ShoreUp: 4,
    GiveTreasureCard: 5,
    CaptureTreasure: 6,
    Sandbags: 7,
    HelicopterLift: 8,
    Discard: 9,
    Done: 10,
    Undo: 11
}