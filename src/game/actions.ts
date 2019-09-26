import { CoordI } from './Coord';

export interface ActionDef {
    text:string;
}

export interface Action {
}

export class DrawTreasureCardAction {
    static text:string = "Draw Treasure Card";
}

export class DrawFloodCardAction {
    static text:string = "Draw Flood Card";
}

export class MoveAction implements CoordI {
    static text:string = "Move";

    constructor(public x:number, public y:number) {}
}

export class ShoreUpAction implements CoordI {
    static text:string = "Shore Up";

    constructor(public x:number, public y:number) {}
}

export class GiveTreasureCardAction {
    static text:string = "Give a Treasure Card";

    constructor(public toPlayer:number) {}
}

export class CaptureTreasureAction {
    static text:string = "Capture Treasure";
}

export class DoneAction {
    static text:string = "Done";
}