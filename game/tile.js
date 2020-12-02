
class Tile {
    constructor(letter, points, creationID) {
        this.letter = letter;
        this.points = points;
        this.creationID = creationID;
        this.id = creationID;
        //this.id = '';
        this.inplay = false;
        this.used = false;
        this.cellid = '';
        this.blank = false;
        this.justplayed = false;
    }
}

module.exports = Tile;