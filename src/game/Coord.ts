export default class Coord implements ICoord {
    constructor(public x:number = 0, public y:number = 0) {}

    toIndex() {
        return this.y * 6 + this.x;
    }

    static fromIndex(index:number):Coord {
        return new Coord(index % 6, Math.floor(index / 6));
    }

    static fromCoord(coord:ICoord):Coord {
        return new Coord(coord.x, coord.y);
    }
}

export interface ICoord {
    x:number;
    y:number;
}

export const MAX_COORD:number = 5;