console.log('yo yo yo');

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const alphanumeric = letters.concat(numbers);

function generateCode(length) {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    console.log(code);
    return code;
}

class Cell {
    constructor(type, pos) {
        this.type = type;
        this.pos = pos;
        this.id = `${pos[0]}_${pos[1]}`;
        this.tile = '';
    }
}


class Board {
    constructor() {
        this.upperLeft = [
            ['TW', '-', '-', 'DL', '-', '-', '-'],
            ['-', 'DW', '-', '-', '-', 'TL', '-'],
            ['-', '-', 'DW', '-', '-', '-', 'DL'],
            ['DL', '-', '-', 'DW', '-', '-', '-'],
            ['-', '-', '-', '-', 'DW', '-', '-'],
            ['-', 'TL', '-', '-', '-', 'TL', '-'],
            ['-', '-', 'DL', '-', '-', '-', 'DL']
        ]
        this.cellsAll = this.init();
    }

    // works for adding or removing a tile on board
    updateCell_tile(tile, cellid) {
        let pos = cellid.split('_');
        //console.log('pos: ', pos);
        let cell = this.cellsAll[Number(pos[0])][Number(pos[1])];
        //console.log('cell: ', cell);
        cell.tile = tile;
    }

    generateFullBoardArray() {
        let lowerLeft = this.upperLeft.slice();
        lowerLeft.reverse();

        let leftHalf = this.upperLeft.concat([this.upperLeft[0]], lowerLeft);

        let full = leftHalf.map((row) => {
            let rowcopy = row.slice();
            rowcopy.reverse();
            let fullRow = row.concat(row[0], rowcopy);
            return fullRow;
        })

        full[7][7] = '*';
        return full;
    }

    init() {
        let full = this.generateFullBoardArray();
        let cellrows = full.map((row, i) => {
            let cells = row.map((cell, y) => {
                let newcell = new Cell(cell, [i, y]);
                return newcell;
            })
            return cells;
        })
        return cellrows;
    }
}



class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.word = '';
        this.rack = [];
        this.id;
    }

    addToScore(pointsFromPlay) {
        this.score += pointsFromPlay;
    }

    updateID(index) {
        this.id = index;
    }
}


class Tile {
    constructor(letter, points, creationID) {
        this.letter = letter;
        this.points = points;
        this.creationID = creationID;
        this.id = '';
        this.inplay = false;
        this.used = false;
    }
}

class Game {
    constructor(numOfPlayers) {
        this.id = generateCode(4);
        this.numOfPlayers = Number(numOfPlayers);
        this.players = [];
        this.ready = false;
        this.turn = 0;
        //this.turn_player = this.players[this.turn];
        this.testSquareColor = 'blue';
        this.board = new Board();
        this.letters = [
            { letter: '-', distributed: 0, tiles: 2, points: 0 },
            { letter: 'A', distributed: 0, tiles: 9, points: 1 },
            { letter: 'B', distributed: 0, tiles: 2, points: 3 },
            { letter: 'C', distributed: 0, tiles: 2, points: 3 },
            { letter: 'D', distributed: 0, tiles: 4, points: 2 },
            { letter: 'E', distributed: 0, tiles: 12, points: 1 },
            { letter: 'F', distributed: 0, tiles: 2, points: 4 },
            { letter: 'G', distributed: 0, tiles: 3, points: 2 },
            { letter: 'H', distributed: 0, tiles: 2, points: 4 },
            { letter: 'I', distributed: 0, tiles: 9, points: 1 },
            { letter: 'J', distributed: 0, tiles: 1, points: 8 },
            { letter: 'K', distributed: 0, tiles: 1, points: 5 },
            { letter: 'L', distributed: 0, tiles: 4, points: 1 },
            { letter: 'M', distributed: 0, tiles: 2, points: 3 },
            { letter: 'N', distributed: 0, tiles: 6, points: 1 },
            { letter: 'O', distributed: 0, tiles: 8, points: 1 },
            { letter: 'P', distributed: 0, tiles: 2, points: 3 },
            { letter: 'Q', distributed: 0, tiles: 1, points: 10 },
            { letter: 'R', distributed: 0, tiles: 6, points: 1 },
            { letter: 'S', distributed: 0, tiles: 4, points: 1 },
            { letter: 'T', distributed: 0, tiles: 6, points: 1 },
            { letter: 'U', distributed: 0, tiles: 4, points: 1 },
            { letter: 'V', distributed: 0, tiles: 2, points: 4 },
            { letter: 'W', distributed: 0, tiles: 2, points: 4 },
            { letter: 'X', distributed: 0, tiles: 1, points: 8 },
            { letter: 'Y', distributed: 0, tiles: 2, points: 4 },
            { letter: 'Z', distributed: 0, tiles: 1, points: 10 }
        ];
        this.tiles = [];
        this.tiles_drawn = [];
        //this.distributedAll = [];
    }

    generateAllTiles() {
        let count = 0;
        this.letters.map((letter) => {
            for (let i=0; i < letter.tiles; i++) {
                let newtile = new Tile(letter.letter, letter.points, count);
                count += 1;
                this.tiles.push(newtile);
            }
          
        })
    }

    addPlayer(name) {
        let playerToAdd = new Player(name);
        this.players.push(playerToAdd);
        playerToAdd.updateID(this.players.length-1);
    }

    /*
    updateRackTile_used(tileid) {
        let tile = this.players[this.turn].rack[tileid];
        if (tile.used === true) {
            tile.used = false;
        } else {
            tile.used = true;
        }
    }
    */

    updateRackTile_inplay(i) {
        let tile = this.players[this.turn].rack[i];
        if (tile.inplay === true) {
            tile.inplay = false;
        } else {
            tile.inplay = true;
        }
    }

    // for adding or removing tile from board during a player's turn
    rackTileOnBoard(tileid, cellid) {
        //let tileindex = Number(tileid.charAt(-1));
        let tileidsplit = tileid.split('_');
        let tileindex = Number(tileidsplit[1]);
        console.log('tileindex: ', tileindex);
        let tile = this.players[this.turn].rack[tileindex];
        console.log('tile: ', tile);
        this.board.updateCell_tile(tile, cellid);
        this.updateRackTile_inplay(tileindex);
    }

    readyToStart() {
        this.generateAllTiles();
        if (this.numOfPlayers === this.players.length) {
            this.distribute_init();
            return true;
        } else {
            return false;
        }
    }

    distribute_init() {
        this.players.forEach((player) => {
            this.distributeTilesToPlayer(player);
        })
    }

    distributeTilesToPlayer(player) {
        let n = 7 - player.rack.length;
        //console.log('n = ', n);
        for (let i = 0; i < n; i++) {
            let index = Math.floor(Math.random() * this.tiles.length);
            let tiledrawn = this.tiles[index];

            player.rack.push(tiledrawn);
            player.rack[i].id = `tile_${i}`;

            this.tiles_drawn.push(tiledrawn);
            this.tiles.splice(index, 1);

            /*
            tiledrawn.distributed += 1;
            if (tiledrawn.distributed === tiledrawn.tiles) {
                this.distributedAll.push(tiledrawn);
                this.tiles.splice(index, 1);
            }

            console.log('i = ', i);
            */
        }
    }

    updateTurn() {
        if (this.turn < this.players.length - 1) {
            this.turn += 1;
        } else {
            this.turn = 0;
        }
    }

}

let activeGames = [];

function findMatchingGameCode(gameCode) {
    for (let game of activeGames) {
        if (gameCode === game.id) {
            return game;
        }
    }
}


let http = require('http');
let fs = require('fs');

let querystring = require('querystring');

http.createServer(function (req, res) {
    //console.log('req: ', req.url);
    //console.log("listening on: 3000");

    // TO DO: add stylesheet

    /*
    if (req.url.includes('naming')) {
        //res.end(console.log(req.url));
        //return;
        let arry = req.url.split('?');
        let qs = querystring.parse(arry[1]);
        console.log(qs);
        let name = qs.name;
        console.log(name);
        let player1 = new Player(name);
        let game1 = new Game(player1);
        let gamehtml = game1.render();
        res.end(gamehtml);
        //res.end(`<div>Welcome ${player1.name}!!</div>`);
        return name;
    }
    */


    if (req.url.endsWith('start')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            //console.log(parsedBody);
            let numOfPlayers = parsedBody.numOfPlayers;
            //let player = new Player(parsedBody.player);
            let newGame = new Game(numOfPlayers);
            newGame.addPlayer(parsedBody.player);
            activeGames.push(newGame);
            //console.log(activeGames);
            res.end(JSON.stringify(newGame));
            return;
        })

        return;
    }

    if (req.url.endsWith('join')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            //console.log(parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.codejoin);
            if (matchingGame !== 'undefined') {
                //let player = new Player(parsedBody.player);
                //matchingGame.players.push(player);
                matchingGame.addPlayer(parsedBody.player);
                if (matchingGame.readyToStart()) {
                    matchingGame.ready = true;
                };
                res.end(JSON.stringify(matchingGame));
                return;
            } else {
                return `game code error`;
            }

        })

        return;
    }


    if (req.url.endsWith('testsquare')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            //console.log(parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);

            matchingGame.testSquareColor = parsedBody.testSquareColor;
            //console.log('updated matchingGame: ', matchingGame);
            //console.log(activeGames);
            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }

    if (req.url.endsWith('tilemove')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log('tilemove body: ', parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            //console.log('tilemove found matchingGame: ', matchingGame);

            matchingGame.rackTileOnBoard(parsedBody.tileid, parsedBody.cellid);

            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }

    if (req.url.endsWith('refresh')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            //console.log(parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);

            //matchingGame.testSquareColor = parsedBody.testSquareColor;
            //console.log('refresh found matchingGame: ', matchingGame);
            //console.log(activeGames);
            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }


    /*
    if (req.url.endsWith('distribute')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log(parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);

            matchingGame.distributeTiles(parsedBody.n);

            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }
*/

    if (req.url.endsWith('index.js')) {
        res.write(fs.readFileSync('./index.js'));
        console.log('index js is called');
        res.end();
        return;
    }

    if (req.url.endsWith('index.html')) {
        res.write(fs.readFileSync('./index.html'));
        console.log('INDEX');
        res.end();
    } else {
        res.write(fs.readFileSync('./index.html'));
        for (let i = 0; i < 10; i++) {
            console.log(i);
        }
        res.end();
    }


}).listen(3000);