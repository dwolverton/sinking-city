export default class Coord {
    constructor(public x:number = 0, public y:number = 0) {}

    toIndex() {
        return this.y * 6 + this.x;
    }

    static fromIndex(index:number):Coord {
        return new Coord(index % 6, Math.floor(index / 6));
    }
}