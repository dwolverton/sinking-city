export default class Coord implements ICoord {
    constructor(public x:number = 0, public y:number = 0) {}

    toIndex():number {
        return this.y * 6 + this.x;
    }

    isInBounds():boolean {
        return this.x >= 0 && this.x < 6 && this.y >= 0 && this.y < 6;
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