export interface AvailableAction {
    type:ActionType;
    locations?:number[];
    pickCard?:boolean;
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
    Sandbags = "Sandbags",
    HelicopterLift = "HelicopterLift",
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
    Sandbags: "Use Sandbags",
    HelicopterLift: "Use Helicopter Lift",
    Discard: "Discard",
    Done: "Done"
}

export const ACTION_ORDER = {
    DrawTreasureCard: 0,
    DrawFloodCard: 1,
    Move: 2,
    ShoreUp: 3,
    GiveTreasureCard: 4,
    CaptureTreasure: 5,
    Sandbags: 6,
    HelicopterLift: 7,
    Discard: 8,
    Done: 9
}