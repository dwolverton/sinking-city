export default class Coord implements CoordI {
    constructor(public x:number = 0, public y:number = 0) {}

    toIndex() {
        return this.y * 6 + this.x;
    }

    static fromIndex(index:number):Coord {
        return new Coord(index % 6, Math.floor(index / 6));
    }

    static fromCoord(coord:CoordI):Coord {
        return new Coord(coord.x, coord.y);
    }
}

export interface CoordI {
    x:number;
    y:number;
}