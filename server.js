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
    updateCell(cell, tile) {
        /*
        let pos = cellid.split('_');
        //console.log('pos: ', pos);
        let cell = this.cellsAll[Number(pos[0])][Number(pos[1])];
        //console.log('cell: ', cell);
        */
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


                // for testing only
                if (i === 7 && y === 7) {
                    let newtile = new Tile("J", 8, 8000);
                    newcell.tile = newtile;
                    newcell.tile.used = true;
                }

                if (i === 6 && y === 7) {
                    let newtile = new Tile("G", 3, 3000);
                    newcell.tile = newtile;
                    newcell.tile.used = true;
                }


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
        this.pointsInPlay = 0;
        this.tilesInPlay = [];
        this.id;
    }

    /*
    // works only for first word played right now
    calculatePointsInPlay() {
        let dw = 0;
        let tw = 0;
        let pointsInPlay = 0;
        this.rack.forEach((tile) => {
            if (tile.inplay) {

                let cell = tile.cellid

                let points = tile.points;
                if (tile.cell.type === 'DW') {
                    dw += 1;
                } else if (tile.cell.type === 'TW') {
                    tw += 1;
                } else if (tile.cell.type === 'DL') {
                    points *= 2;
                } else if (tile.cell.type === 'TL') {
                    points *= 3;
                }
                pointsInPlay += points;
            }
        })
        for (let i=0; i < dw; i++) {
            pointsInPlay *= 2;
        }
        for (let i=0; i < tw; i++) {
            pointsInPlay *= 3;
        }

        return pointsInPlay;

    }
    */

    updateScore() {
        this.score += this.pointsInPlay;
        this.pointsInPlay = 0;
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
        this.cellid = '';
        this.highlight = false;
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
            { letter: '-', distributed: 0, tiles: 200, points: 0 },
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

    assignLetterToBlankTile(tileid, letter) {
        
        let tileidsplit = tileid.split('_');
        let tileindex = Number(tileidsplit[1]);
        let tile = this.players[this.turn].rack[tileindex];
        tile.letter = letter;
        tile.highlight = true;
        console.log(tile);
        
        /*
        this.players[this.turn].tilesInPlay.forEach((inplay) => {
            if (tileid === inplay.tile.id) {
                //letter.toUpperCase();
                inplay.tile.letter === letter;
            }
        })
        */
       
    }

    undo() {
        this.players[this.turn].tilesInPlay.forEach((inplay) => {
            let cell = this.board.cellsAll[inplay.row][inplay.col];
            cell.tile = '';
            inplay.tile.inplay = false;
        })
        this.players[this.turn].tilesInPlay = [];
        this.players[this.turn].pointsInPlay = 0;
    }

    endturn() {
        this.players[this.turn].updateScore();

        let newrack = this.players[this.turn].rack.map((tile, i) => {
            if (tile.inplay) {

                tile.inplay = false;
                tile.used = true;
                tile.id = tile.creationID;

                // draw a new tile to add to the rack at that index
                let drawnTile = this.drawNewTileForRack(i);
                //this.players[this.turn].rack.splice(i, 1, drawnTile);
                return drawnTile;
            } else {
                return tile;
            }
        })

        // reset rack
        this.players[this.turn].rack = newrack;

        // reset tilesinplay
        this.players[this.turn].tilesInPlay = [];

        // update game turn
        this.updateTurn();

        /*
        this.players[this.turn].tilesInPlay.forEach((inplay) => {
            // update tile status in its board cell
            let boardcell = this.board.cellsAll[inplay.row][inplay.col];
            boardcell.tile.used = true;
            boardcell.tile.inplay = false;

            // remove the tile from the player's rack

        })
        */
    }


    generateAllTiles() {
        let count = 0;
        this.letters.map((letter) => {
            for (let i = 0; i < letter.tiles; i++) {
                let newtile = new Tile(letter.letter, letter.points, count);
                count += 1;
                this.tiles.push(newtile);
            }

        })
    }

    addPlayer(name) {
        let playerToAdd = new Player(name);
        this.players.push(playerToAdd);
        playerToAdd.updateID(this.players.length - 1);
    }


    collectData_inPlayTiles() {
        // for each tile in the rack, create an array of ptvalues for adjacent already 'used' tiles on the board (ie. not any from rack currently in play) in each direction (vertical, horizontal). Only the ptvalue and position needs to be recorded. In any direction, iterate to the next cell over until the cell does not contain a 'used' tile.
        let tiles_in_play = [];
        this.players[this.turn].rack.forEach((tile) => {
            if (tile.inplay) {

                // get cell from cellid
                let pos = tile.cellid.split('_');
                let row = Number(pos[0]);
                let col = Number(pos[1]);
                let cell = this.board.cellsAll[row][col];

                let in_play = {
                    tile: tile,
                    row: row,
                    col: col,
                    cell: cell,
                    adjacent_used: {
                        vertical: [],
                        horizontal: []
                    }
                }

                let position = [row, col];
                let directions = [{ limit: 15, step: 1 }, { limit: 0, step: -1 }];

                position.forEach((rowORcol, i) => {

                    directions.forEach((direction) => {
                        //if (rowORcol !== direction.limit) {
                        if (rowORcol < 14 && rowORcol > 0) {
                            let steps = direction.step;
                            let checknext = true;
                            while (checknext) {

                                
                                let nextcell = '';
                                let pushTo = '';
                                if (i === 0) {
                                    //console.log('row + steps: ', (row+steps)) ;
                                    nextcell = this.board.cellsAll[position[i] + steps][col];
                                    pushTo = in_play.adjacent_used.vertical;
                                } else {
                                    nextcell = this.board.cellsAll[row][position[i] + steps];
                                    pushTo = in_play.adjacent_used.horizontal;
                                }

                                if (nextcell.tile !== '') {
                                    if (nextcell.tile.used) {
                                        pushTo.push(nextcell);
                                        steps += direction.step;

                                        if ((rowORcol + steps) > 14 || (rowORcol + steps) < 0) {
                                            checknext = false;
                                        }

                                    } else {
                                        checknext = false;
                                    }
                                } else {
                                    checknext = false;
                                }

                            }
                        }
                    })

                });



                /*
                // rowORcol + steps
                if (rowORcol !== 15) {
                    let steps = 1;
                    while ((rowORcol + steps) <= 15) {
                        let nextcell = '';
                        let pushTo = '';
                        if (rowORcol === row) {
                            nextcell = this.board.cellsAll[rowORcol + steps][col];
                            pushTo = in_play.adjacent_used.vertical;
                        } else {
                            nextcell = this.board.cellsAll[row][rowORcol + steps];
                            pushTo = in_play.adjacent_used.horizontal;
                        }

                        if (nextcell.tile !== '') {
                            if (nextcell.tile.used) {
                                //adjacencies.push(nextcell);
                                pushTo.push(nextcell);
                                step += 1;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }

                    }
                }
            })
            */


                /*
                // check up if cell inplay is not at very top (TODO: add down)
                if (row !== 0) {
                    let step = 1;
                    while ((row - step) >= 0) {
                        let nextcell = this.board.cellsAll[row - step][col];
                        //console.log('nextcell up: ', nextcell);
                        if (nextcell.tile !== '') {
                            if (nextcell.tile.used) {
                                in_play.adjacent_used.vertical.push(nextcell);
                                //console.log('vertical: ', in_play.adjacent_used.vertical);
                                step += 1;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                */

                /*
                // check left if cell is not at very left (TODO: add right)
                if (col !== 0) {
                    let step = 1;
                    while ((col - step) >= 0) {
                        let nextcell = this.board.cellsAll[row][col - step];
                        //console.log('nextcell left: ', nextcell);
                        if (nextcell.tile !== '') {
                            if (nextcell.tile.used) {
                                in_play.adjacent_used.horizontal.push(nextcell);
                                //console.log('horizontal: ', in_play.adjacent_used.horizontal);
                                step += 1;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                */

                console.log(in_play.adjacent_used);
                tiles_in_play.push(in_play);

            }

        })

        //console.log('tiles_in_play: ', tiles_in_play);
        //console.log(tiles_in_play);
        this.players[this.turn].tilesInPlay = tiles_in_play;
        return tiles_in_play;

        // pass tiles_in_play to updatePointsInPlay.............

        // later the arrays for each inplay rack tile will be joined into a Set so there are no duplicates when calculating the score

    }





    compileWordsInPlay(tilesInPlay) {

        // take the array of tilesInPlay with adjacent used tiles stored
        // first determines the direction the player is playing from comparing the row positions of the first two tiles

        let mainword = new Set();

        let allwords = [];

        let maindirection = 'vertical';
        let otherdirection = 'horizontal';
        if (tilesInPlay.length > 1) {
            if (tilesInPlay[0].row === tilesInPlay[1].row) {
                maindirection = 'horizontal';
                otherdirection = 'vertical';
            }
        }


        // if the word is vertical, then it iterates through each tile
        // first adds its adjacent_used.vertical cells to a Set called 'main word'


        tilesInPlay.forEach((tile) => {

            if (tilesInPlay.length > 1 || (tilesInPlay.length === 1 && (tile.adjacent_used[maindirection].length > 0 && tile.adjacent_used[otherdirection].length > 0))) {

                // main word
                mainword.add(tile.cell);
                tile.adjacent_used[maindirection].forEach((cell) => {
                    mainword.add(cell);
                });

                // other word (if it exists)
                if (tile.adjacent_used[otherdirection].length > 0) {
                    let otherword = [];
                    otherword.push(tile.cell);
                    tile.adjacent_used[otherdirection].forEach((cell) => {
                        otherword.push(cell);
                    });
                    allwords.push(otherword);
                }

            } else {
                if (tile.adjacent_used[maindirection].length > 0) {
                    mainword.add(tile.cell);
                    tile.adjacent_used[maindirection].forEach((cell) => {
                        mainword.add(cell);
                    });
                } else if (tile.adjacent_used[otherdirection].length > 0) {
                    let otherword = [];
                    otherword.push(tile.cell);
                    tile.adjacent_used[otherdirection].forEach((cell) => {
                        otherword.push(cell);
                    });
                    allwords.push(otherword);
                } else {
                    mainword.add(tile.cell);
                }


            }



        })

        //console.log('mainword = ', mainword);
        //console.log('allwords = ', allwords); 

        let mainwordarry = Array.from(mainword);
        allwords.push(mainwordarry);

        return allwords;

    }

    // TODO: ***** FIX bug when first tile played is counted as 2 words, the first of just the letter itself, the second with the word it creates with the adjacent letters.

    updatePointsInPlay(wordsInPlay) {
        let totalpoints = 0;

        wordsInPlay.forEach((wordarry) => {
            let wordpoints = 0;
            let dw = 0;
            let tw = 0

            wordarry.forEach((cell) => {
                let points = cell.tile.points;

                // only include board cell types in calculating total points for inplay (not used) tiles
                if (cell.tile.inplay) {

                    if (cell.type === 'DW') {
                        dw += 1;
                    } else if (cell.type === 'TW') {
                        tw += 1;
                    } else if (cell.type === 'DL') {
                        points *= 2;
                    } else if (cell.type === 'TL') {
                        points *= 3;
                    }

                }

                wordpoints += points;
            })

            for (let i = 0; i < dw; i++) {
                wordpoints *= 2;
            }
            for (let i = 0; i < tw; i++) {
                wordpoints *= 3;
            }

            totalpoints += wordpoints;

        })

        console.log('totalpoints = ', totalpoints);
        this.players[this.turn].pointsInPlay = totalpoints;
        return totalpoints;

    }


    // only works for very first turn in the game, with no other words on the board.
    oldupdatePointsInPlay() {
        let dw = 0;
        let tw = 0;
        let pointsInPlay = 0;
        let cellpositions = [];
        let tilesInPlay = [];

        this.players[this.turn].rack.forEach((tile) => {
            if (tile.inplay) {

                tilesInPlay.push(tile);

                // get cell from cellid
                let pos = tile.cellid.split('_');
                pos[0] = Number(pos[0]);
                pos[1] = Number(pos[1]);
                let cell = this.board.cellsAll[pos[0]][pos[1]];
                //let cell = this.board.cellsAll[Number(pos[0])][Number(pos[1])];

                /*
                if (tilesInPlay.length < 1) {
                    tilesInPlay.push(tile);
                } else {
                    for (let i=0; i < tilesInPlay.length; i++) {
                        let tileB = tilesInPlay[i];
                        let posB = tileB.cellid.split('_');
                        posB[0] = Number(posB[0]);
                        posB[1] = Number(posB[1]);
                        if (pos[0] > posB[0]) {

                        }
                    }
                }
                */

                // add to list of cell positions in play
                // cellpositions.push([Number(pos[0]), Number(pos[1])]);

                let points = tile.points;
                if (cell.type === 'DW') {
                    dw += 1;
                } else if (cell.type === 'TW') {
                    tw += 1;
                } else if (cell.type === 'DL') {
                    points *= 2;
                } else if (cell.type === 'TL') {
                    points *= 3;
                }
                pointsInPlay += points;
            }

            // need to determine direction of play first (vertical or horizontal)

            // TODO: check adjacent cells using pos stored in cellid for each tile in play. If adjacent cell contains a tile, add just the ptvalue of the tile at that cell to pointsInPlay.
            // check up, left, right, and down
            // if there is a tile in one of these directions then continue going in that direction and add points...

        })

        // compare first and last cell positions to determine direction

        let direction = '';


        // TODO: add for only one tile played...should just check all directions for tiles and add up scores?

        if (tilesInPlay.length > 1) {

            tilesInPlay.sort((a, b) => {
                let pos_a = a.cellid.split('_');
                let pos_b = b.cellid.split('_');

                // if the rows aren't the same...
                if (Number(pos_a[0]) !== Number(pos_b[0])) {
                    direction = 'vertical';
                    return Number(pos_a[0]) - Number(pos_b[0]);
                } else {
                    direction = 'horizontal';
                    return Number(pos_a[1]) - Number(pos_b[1]);
                }
            })

        }

        // first means top-most if vertical, and left-most if horizontal
        let first = tilesInPlay[0].cellid.split('_');
        first[0] = Number(first[0]);
        first[1] = Number(first[1]);
        // last means bottom-most if vertical, and right-most if horizontal
        let last = tilesInPlay[tilesInPlay.length - 1].cellid.split('_');
        last[0] = Number(last[0]);
        last[1] = Number(last[1]);

        if (direction === 'horizontal') {
            // check left for adjacent tiles on board

            let nextcell = this.board.cellsAll[first[0]][first[1] - 1];
            if (nextcell.tile !== '') {
                let points = nextcell.tile.points;
                pointsInPlay += points;
                //cellsInDirection.push(nextcell);
                //console.log('check left, nextcell: ', nextcell);
            }

            /*
            for (let i = 0; i < 14; i++) {
                let nextcell = this.board.cellsAll[first[0]][first[1] - i];
                if (nextcell.tile !== '') {
                    let points = nextcell.tile.points;
                    pointsInPlay += points;
                    //cellsInDirection.push(nextcell);
                    console.log('check left, nextcell: ', nextcell);
                } else {
                    console.log('break at i=', i);
                    break
                }
            }
            */


            // check right

            let nextcell_r = this.board.cellsAll[last[0]][last[1] + 1];
            if (nextcell_r.tile !== '') {
                let points = nextcell_r.tile.points;
                pointsInPlay += points;
                //cellsInDirection.push(nextcell);
                //console.log('check right, nextcell_r: ', nextcell_r);
            }

            /*
            for (let i = 0; i < 14; i++) {
                let nextcell = this.board.cellsAll[last[0]][last[1] + i];
                if (nextcell.tile !== '') {
                    let points = nextcell.tile.points;
                    pointsInPlay += points;
                    //cellsInDirection.push(nextcell);
                    console.log('check right, nextcell: ', nextcell);
                } else {
                    console.log('break at i=', i);
                    break
                }
            }
            */

        } else {
            direction === 'vertical';
            // check up
            for (let i = 0; i < 14; i++) {
                let nextcell = this.board.cellsAll[first[0] - 1][first[1]];
                if (nextcell.tile !== '') {
                    let points = nextcell.tile.points;
                    pointsInPlay += points;
                    //cellsInDirection.push(nextcell);
                    //console.log('check up, nextcell: ', nextcell);
                } else {
                    //console.log('break at i=', i);
                    break
                }
            }
            // check down
            for (let i = 0; i < 14; i++) {
                let nextcell = this.board.cellsAll[last[0] + 1][last[1]];
                if (nextcell.tile !== '') {
                    let points = nextcell.tile.points;
                    pointsInPlay += points;
                    //cellsInDirection.push(nextcell);
                    //console.log('check down, nextcell: ', nextcell);
                } else {
                    //console.log('break at i=', i);
                    break;
                }
            }
        }

        for (let i = 0; i < dw; i++) {
            pointsInPlay *= 2;
        }
        for (let i = 0; i < tw; i++) {
            pointsInPlay *= 3;
        }

        // then check around word played for other adjacencies based on direction




        // then update with total pointsInPlay
        this.players[this.turn].pointsInPlay = pointsInPlay;

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

    updateRackTile(tile, cellid) {
        tile.cellid = cellid;
        if (cellid !== '') {
            if (tile.inplay === false) {
                tile.inplay = true;
            }
        }
    }


    tileMove(tileid, cellid) {
        // get tile from tileid
        let tileidsplit = tileid.split('_');
        let tileindex = Number(tileidsplit[1]);
        let tile = this.players[this.turn].rack[tileindex];
        // if tile is already on board and being moved to another cell...
        if (tile.inplay) {
            this.inplayTileMove(tile, cellid);
        } else {
            this.rackTileOnBoard(tile, cellid);
        }
    }


    inplayTileMove(tile, cellid) {
        // get cell from cellid
        let pos = cellid.split('_');
        let row = Number(pos[0]);
        let col = Number(pos[1])
        let cell = this.board.cellsAll[row][col];
        // update cell with tile
        this.board.updateCell(cell, tile);

        // first get current cell that tile was on
        this.players[this.turn].tilesInPlay.forEach((inplay) => {
            if (inplay.tile === tile) {
                let currentCell = inplay.cell;
                // update current cell with no tile
                this.board.updateCell(currentCell, '');

                /*
                // set inplay cell with new cell info
                inplay.row = row;
                inplay.col = col;
                inplay.cell = cell;
                */
            }
        })

        // update the rack cell
        this.updateRackTile(tile, cellid);

        let tilesInPlay = this.collectData_inPlayTiles();
        let wordsInPlay = this.compileWordsInPlay(tilesInPlay);
        this.updatePointsInPlay(wordsInPlay);

    }


    // for adding or removing tile from board during a player's turn
    rackTileOnBoard(tile, cellid) {
        // get tile from tileid
        //let tileidsplit = tileid.split('_');
        //let tileindex = Number(tileidsplit[1]);
        //let tile = this.players[this.turn].rack[tileindex];
        // update tile with cellid
        this.updateRackTile(tile, cellid);

        // update pointsInPlay
        //this.updatePointsInPlay();

        // get cell from cellid
        let pos = cellid.split('_');
        let cell = this.board.cellsAll[Number(pos[0])][Number(pos[1])];
        // update cell with tile
        this.board.updateCell(cell, tile);

        let tilesInPlay = this.collectData_inPlayTiles();
        let wordsInPlay = this.compileWordsInPlay(tilesInPlay);
        this.updatePointsInPlay(wordsInPlay);
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

    drawNewTileForRack(i) {
        let index = Math.floor(Math.random() * this.tiles.length);
        let tiledrawn = this.tiles[index];
        tiledrawn.id = `tile_${i}`;

        this.tiles_drawn.push(tiledrawn);
        this.tiles.splice(index, 1);

        return tiledrawn;
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

            matchingGame.tileMove(parsedBody.tileid, parsedBody.cellid);

            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }

    // assignLetterToBlankTile
    if (req.url.endsWith('assignLetterToBlankTile')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log('assignLetterToBlankTile: ', parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            //console.log('tilemove found matchingGame: ', matchingGame);

            matchingGame.assignLetterToBlankTile(parsedBody.tileid, parsedBody.letter);

            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }


    if (req.url.endsWith('endturn')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log('endturn body: ', parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            matchingGame.endturn();

            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }

    if (req.url.endsWith('undo')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log('endturn body: ', parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            matchingGame.undo();

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