export class Tile {
    constructor(
        readonly id:number,
        readonly name:string,
        readonly treasure:Treasure = null,
        readonly landing:boolean = false
    ) {}
}

export class TreasureCard {
    constructor(
        readonly id:number,
        readonly treasure:Treasure = null,
        readonly special:TreasureCardSpecial = null
    ) {}
}

export class TreasureCardSpecial {
    constructor(
        readonly name:string,
        readonly emoji:string
    ) {}
    static readonly WATERS_RISE:TreasureCardSpecial = new TreasureCardSpecial("Waters Rise!", "🌊");
    static readonly HELICOPTER_LIFT:TreasureCardSpecial = new TreasureCardSpecial("Helicopter Lift", "🚁");
    static readonly SANDBAGS:TreasureCardSpecial = new TreasureCardSpecial("Sandbags", "💰");
}

export class FloodCard {
    constructor(
        readonly id:number,
        readonly tile:Tile = null
    ) {}
}

export class Role {
    constructor(
        readonly id:number,
        readonly name:string,
        readonly color:string,
        readonly startingTile:number
    ) {}
    static readonly EXPLORER:number = 0;
    static readonly PILOT:number = 1;
    static readonly ENGINEER:number = 2;
    static readonly DIVER:number = 3;
    static readonly MESSENGER:number = 4;
    static readonly NAVIGATOR:number = 5;
}

export class Treasure {
    constructor(
        readonly id:number,
        readonly name:string,
        readonly emoji:string
    ) {}
}

let idCtr = 0;
export const TREASURES:ReadonlyArray<Treasure> = [
    new Treasure(idCtr++, "Treat", "🍦"),
    new Treasure(idCtr++, "Meal", "🍽️"), // or 🍱
    new Treasure(idCtr++, "Coffee", "☕"),
    new Treasure(idCtr++, "Government", "🏛️")
];

idCtr = 0;
export const TILES:ReadonlyArray<Tile> = [
    new Tile(idCtr++, "Exit 55", null, true), // pilot
    new Tile(idCtr++, "Burk's Igloo", TREASURES[0]),
    new Tile(idCtr++, "Detroit Donut", TREASURES[0]),
    new Tile(idCtr++, "Sheeba Restaurant", TREASURES[1]),
    new Tile(idCtr++, "Aladdin Sweets & Cafe", TREASURES[1]), // explorer
    new Tile(idCtr++, "Cafe 1923", TREASURES[2]),
    new Tile(idCtr++, "Oloman Cafe", TREASURES[2]),
    new Tile(idCtr++, "City Hall", TREASURES[3]), // messenger
    new Tile(idCtr++, "Fire Station", TREASURES[3]),
    new Tile(idCtr++, "Detroit Zen Center"),
    new Tile(idCtr++, "Hamtramck Public Library"),
    new Tile(idCtr++, "Planet Ant Theatre"),
    new Tile(idCtr++, "Suzy's Bar"),
    new Tile(idCtr++, "Fat Salmon Sushi"), // diver
    new Tile(idCtr++, "Royal Kabob"),
    new Tile(idCtr++, "Polish Village Cafe"),
    new Tile(idCtr++, "Veteran's Park"),
    new Tile(idCtr++, "Pulaski Park"),
    new Tile(idCtr++, "Pope Park"),
    new Tile(idCtr++, "Sylhet Farms"),
    new Tile(idCtr++, "Better Life Bags"), // navigator
    new Tile(idCtr++, "Bon Bon Bon"),
    new Tile(idCtr++, "Sisterhood Fitness"),
    new Tile(idCtr++, "Hamtramck Disneyland") // engineer
];

idCtr = 0;
export const TREASURE_CARDS:ReadonlyArray<TreasureCard> = [
    new TreasureCard(idCtr++, TREASURES[0]),
    new TreasureCard(idCtr++, TREASURES[0]),
    new TreasureCard(idCtr++, TREASURES[0]),
    new TreasureCard(idCtr++, TREASURES[0]),
    new TreasureCard(idCtr++, TREASURES[0]),
    new TreasureCard(idCtr++, TREASURES[1]),
    new TreasureCard(idCtr++, TREASURES[1]),
    new TreasureCard(idCtr++, TREASURES[1]),
    new TreasureCard(idCtr++, TREASURES[1]),
    new TreasureCard(idCtr++, TREASURES[1]),
    new TreasureCard(idCtr++, TREASURES[2]),
    new TreasureCard(idCtr++, TREASURES[2]),
    new TreasureCard(idCtr++, TREASURES[2]),
    new TreasureCard(idCtr++, TREASURES[2]),
    new TreasureCard(idCtr++, TREASURES[2]),
    new TreasureCard(idCtr++, TREASURES[3]),
    new TreasureCard(idCtr++, TREASURES[3]),
    new TreasureCard(idCtr++, TREASURES[3]),
    new TreasureCard(idCtr++, TREASURES[3]),
    new TreasureCard(idCtr++, TREASURES[3]),
    new TreasureCard(idCtr++, null, TreasureCardSpecial.WATERS_RISE), // 20
    new TreasureCard(idCtr++, null, TreasureCardSpecial.WATERS_RISE),
    new TreasureCard(idCtr++, null, TreasureCardSpecial.WATERS_RISE),
    new TreasureCard(idCtr++, null, TreasureCardSpecial.HELICOPTER_LIFT),
    new TreasureCard(idCtr++, null, TreasureCardSpecial.HELICOPTER_LIFT),
    new TreasureCard(idCtr++, null, TreasureCardSpecial.HELICOPTER_LIFT),
    new TreasureCard(idCtr++, null, TreasureCardSpecial.SANDBAGS),
    new TreasureCard(idCtr++, null, TreasureCardSpecial.SANDBAGS),
];

idCtr = 0;
export const FLOOD_CARDS:ReadonlyArray<FloodCard> = TILES.map(tile => new FloodCard(idCtr++, tile));

idCtr = 0;
export const ROLES:ReadonlyArray<Role> = [
    new Role(idCtr++, "Explorer", "green", 23),
    new Role(idCtr++, "Pilot", "blue", 0),
    new Role(idCtr++, "Engineer", "red", 4),
    new Role(idCtr++, "Diver", "black", 13),
    new Role(idCtr++, "Messenger", "gray", 7),
    new Role(idCtr++, "Navigator", "yellow", 20)
];

export const WATER_LEVELS:ReadonlyArray<number> = [
    2, 2, 3, 3, 3, 4, 4, 5, 5, 6
];

export const DIFFICULTIES:ReadonlyArray<string> = [
    "Novice", "Normal", "Elite", "Legendary"
]