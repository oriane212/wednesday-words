
class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.mainword = '';
        this.mainwordcells = [];
        this.otherwords = [];
        this.hasvalidplay = false;
        this.invalidword = '';
        this.rack = [];
        this.pointsInPlay = 0;
        this.tilesInPlay = [];
        this.id;
    }

    updateScore(pointsInPlay) {
        this.score += pointsInPlay;
        this.pointsInPlay = 0;
    }

    updateID(index) {
        this.id = index;
    }
}

module.exports = Player;