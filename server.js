let http = require('http');
let fs = require('fs');

const fetch = require('node-fetch');

console.log('yo yo yo');

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let port = process.env.PORT || 3000;

function generateCode(length) {
    const letters_no_o = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
    const numbers = "123456789";
    const alphanumeric = letters_no_o.concat(numbers);
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
                /*
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
                */

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

    updateScore(pointsInPlay) {
        this.score += pointsInPlay;
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
        this.id = creationID;
        //this.id = '';
        this.inplay = false;
        this.used = false;
        this.cellid = '';
        this.blank = false;
        this.justplayed = false;
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
            { letter: '-', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 0 },
            { letter: 'A', distributed: 0, fakecountfortesting: 1, tiles: 9, points: 1 },
            { letter: 'B', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 3 },
            { letter: 'C', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 3 },
            { letter: 'D', distributed: 0, fakecountfortesting: 1, tiles: 4, points: 2 },
            { letter: 'E', distributed: 0, fakecountfortesting: 1, tiles: 12, points: 1 },
            { letter: 'F', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 4 },
            { letter: 'G', distributed: 0, fakecountfortesting: 1, tiles: 3, points: 2 },
            { letter: 'H', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 4 },
            { letter: 'I', distributed: 0, fakecountfortesting: 1, tiles: 9, points: 1 },
            { letter: 'J', distributed: 0, fakecountfortesting: 1, tiles: 1, points: 8 },
            { letter: 'K', distributed: 0, fakecountfortesting: 1, tiles: 1, points: 5 },
            { letter: 'L', distributed: 0, fakecountfortesting: 1, tiles: 4, points: 1 },
            { letter: 'M', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 3 },
            { letter: 'N', distributed: 0, fakecountfortesting: 1, tiles: 6, points: 1 },
            { letter: 'O', distributed: 0, fakecountfortesting: 1, tiles: 8, points: 1 },
            { letter: 'P', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 3 },
            { letter: 'Q', distributed: 0, fakecountfortesting: 1, tiles: 1, points: 10 },
            { letter: 'R', distributed: 0, fakecountfortesting: 1, tiles: 6, points: 1 },
            { letter: 'S', distributed: 0, fakecountfortesting: 1, tiles: 4, points: 1 },
            { letter: 'T', distributed: 0, fakecountfortesting: 1, tiles: 6, points: 1 },
            { letter: 'U', distributed: 0, fakecountfortesting: 1, tiles: 4, points: 1 },
            { letter: 'V', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 4 },
            { letter: 'W', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 4 },
            { letter: 'X', distributed: 0, fakecountfortesting: 1, tiles: 1, points: 8 },
            { letter: 'Y', distributed: 0, fakecountfortesting: 1, tiles: 2, points: 4 },
            { letter: 'Z', distributed: 0, fakecountfortesting: 1, tiles: 1, points: 10 }
        ];
        this.tiles = this.generateAllTiles();;
        this.tiles_drawn = [];
        this.gameover = false;
        this.lastplayed = [];
        this.lastplayedwords = [];
        //this.distributedAll = [];
        this.demowords = [

            { play: 'WED', vertical: false, start: [7, 5], score: 14, tiles: [] },
            { play: 'NESDAY', vertical: false, start: [7, 8], score: 19, tiles: [] },
            { play: 'EMO', vertical: true, start: [8, 11], score: 7, tiles: [] },
            { play: 'WORDS', vertical: true, start: [4, 7], score: 9, tiles: [] }
        ]
        this.demo = false;
    }

    addDemoWordsToBoard() {
        console.log('addDemoWordsToBoard');
        for (let word of this.demowords) {
            console.log(word);

            let pos = word.start;
            let i = word.vertical ? 0 : 1; // if word is played vertically, increment row by 1, otherwise increment col by 1
            console.log('pos: ', pos);
            console.log('i = ', i);

            for (let letter of word.play) {
                console.log('letter: ', letter);
                let boardcell = this.board.cellsAll[pos[0]][pos[1]];
                console.log('boardcell: ', boardcell);
                // if no tile is already in that spot on board, add tile for that letter
                if (boardcell.tile === '') {
                    let tile = this.getTileForDemo(letter);
                    tile.used = true;
                    tile.cellid = `${pos[0]}_${pos[1]}`;
                    word.tiles.push(tile);
                    this.board.updateCell(boardcell, tile);
                }
                pos[i] += 1;
            }
        }
    }

    websterLookUp(word) {
        let promise = (fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=a662cfbc-08de-4c57-afe6-989722d50903`).then((res) => {
            return res.json();
        }).then((res) => {
            let firstresult = res[0];
            let shortdef_arry = firstresult.shortdef;
            //value = shortdef_arry[0];
            //console.log('value being returned: ', value);
            //return value;
            console.log('returned ', shortdef_arry[0]);
            return { word: word, def: shortdef_arry[0] };
        }).catch(error => {
            console.error(error.message);
            //invalidword = word;
            //validword = false;
            return { word: word, def: 'NA' };
        })
        )
        return promise;
    }

    endgame() {
        console.log('game ends here');
        // for each other player in game, substract leftover pt values from their score, and add to in-turn player's final score
        let endpoints = 0;
        this.players.forEach((player, i) => {
            if (i !== this.turn) {
                player.rack.forEach((tile) => {
                    endpoints += tile.points;
                    player.score -= tile.points;
                })
            }
        })
        this.players[this.turn].score += endpoints;

        // set this.gameover to true so overlay with winner and button to play again pops up
        this.gameover = true;
    }

    assignLetterToBlankTile(tileid, letter) {

        /*
        let tileidsplit = tileid.split('_');
        let tileindex = Number(tileidsplit[1]);
        let tile = this.players[this.turn].rack[tileindex];
        */
        this.players[this.turn].rack.forEach((racktile) => {
            if (racktile.id === Number(tileid)) {
                racktile.letter = letter;
                //racktile.highlight = true;
            }
        })


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
        let wasinplay = this.players[this.turn].tilesInPlay.pop();
        //inplay.tile.inplay = false;]

        // update the rack tile's cell info
        this.updateRackTile(wasinplay.tile, '');

        // update board cell
        let cell = this.board.cellsAll[wasinplay.row][wasinplay.col];
        //cell.tile = '';
        this.board.updateCell(cell, '');

        // update tiles in play array
        //let tilesInPlay = this.updateTilesInPlay(wasinplay.tile);
        // update points in play

        let wordsInPlay = this.compileWordsInPlay(this.players[this.turn].tilesInPlay);
        this.players[this.turn].hasvalidplay = this.isTilePlacementValid();
        this.updatePointsInPlay(wordsInPlay);

    }

    updateLastPlayed() {
        this.lastplayed.forEach((tile) => {
            tile.lastplayed = false;
        })
        this.lastplayed = [];
    }

    endturn() {

        this.players[this.turn].invalidword = '';
        let isValidPlay = this.players[this.turn].hasvalidplay;

        if (isValidPlay) {

            // look up words
            let validword = true;
            let invalidword = '';
            let words = [];
            let main = this.players[this.turn].mainword;
            words.push(main);
            //words.push({ word: main, def: '' });
            let others = this.players[this.turn].otherwords;
            if (others.length > 0) {
                others.forEach((other) => {
                    //words.push({ word: other, def: '' });
                    words.push(other);
                })
            }


            ///////// TODO: remove duplicate words before lookup, but make sure it doesn't affect points in play and final score

            /////// TODO: handle 'undefined' response (eg. def lookup for 'ME');

            //// TODO: do not allow so many abbreviations?


            //let definitions = [];

            let promises = [];

            words.forEach((word) => {
                if (validword) {
                    //let eachPromise = checkDef(obj.word);


                    let eachPromise = this.websterLookUp(word);

                    promises.push(eachPromise);

                }
            })

            Promise.all(promises).then((values) => {
                values.forEach((value) => {
                    if (value.def === 'NA') {
                        invalidword = value.word;
                        validword = false;
                    }
                })
                if (invalidword !== '') {
                    // a word played does not exist in Merriam Webster dictionary
                    this.players[this.turn].invalidword = invalidword;
                } else {

                    // all words are valid

                    this.updateLastPlayed();
                    this.lastplayedwords = [];
                    this.lastplayedwords = values;

                    /*
                    this.lastplayedwords.push(this.players[this.turn].mainword);
                    this.players[this.turn].otherwords.forEach((word) => {
                        this.lastplayedwords.push(word);
                    })
                    */

                    this.players[this.turn].updateScore(this.players[this.turn].pointsInPlay);

                    // if player played all tiles in rack and no tiles left in the game, then end game
                    if ((this.players[this.turn].tilesInPlay.length === this.players[this.turn].rack.length) && this.tiles.length === 0) {

                        this.endgame();

                    } else {

                        /*
                        this.updateLastPlayed();
        
                        this.lastplayedwords = [];
        
                        this.lastplayedwords.push(this.players[this.turn].mainword);
                        this.players[this.turn].otherwords.forEach((word) => {
                            this.lastplayedwords.push(word);
                        })
                        */

                        let newrack = [];
                        this.players[this.turn].rack.forEach((tile, i) => {
                            if (tile.inplay) {

                                tile.lastplayed = true;
                                this.lastplayed.push(tile);

                                tile.inplay = false;
                                tile.used = true;
                                //tile.id = tile.creationID;

                                if (this.tiles.length > 0) {
                                    // draw a new tile to add to the rack at that index
                                    let drawnTile = this.drawNewTileForRack(i);
                                    newrack.push(drawnTile);
                                }

                            } else {
                                newrack.push(tile);
                            }
                        })

                        // reset rack
                        this.players[this.turn].rack = newrack;

                        // reset tilesinplay
                        this.players[this.turn].tilesInPlay = [];

                        // reset valid play
                        this.players[this.turn].hasvalidplay = false;

                        // update game turn
                        this.updateTurn();

                    }



                }

            })


        }


    }



    generateAllTiles() {
        let tiles = [];
        let count = 0;
        this.letters.map((letter) => {
            for (let i = 0; i < letter.tiles; i++) {
                let newtile = new Tile(letter.letter, letter.points, count);
                if (letter.letter === '-') {
                    newtile.blank = true;
                }
                count += 1;
                tiles.push(newtile);
            }

        })
        return tiles;
    }

    addPlayer(name) {
        let playerToAdd = new Player(name);
        this.players.push(playerToAdd);
        playerToAdd.updateID(this.players.length - 1);
        this.readyToStart();
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

                    console.log('position: ', position);

                    directions.forEach((direction) => {

                        console.log('direction: ', direction);

                        //if (rowORcol !== direction.limit) {
                        if (!(rowORcol > 14) && !(rowORcol < 0)) {
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


    isTilePlacementValid() {

        // first check: all tilesInPlay are in either same col or same row if tilesInPlay.length > 1

        let firstcheckvalid = false;

        // perpend direct default is row
        let perpendiculardirection = 0;

        if (this.players[this.turn].tilesInPlay.length > 1) {

            // create copy of just cells to sort for checking to preserve order of tilesinPlay (which are in order of tiles played)
            let tilesInPlay_cells = this.players[this.turn].tilesInPlay.map((inplay) => {
                return inplay.cell;
            })

            this.sortCellsToMakeWord(tilesInPlay_cells);

            // check rows and cols
            let rows = tilesInPlay_cells.map((cell) => {
                return cell.pos[0];
            })
            let cols = tilesInPlay_cells.map((cell) => {
                return cell.pos[1];
            })

            let rowset = new Set(rows);
            let colset = new Set(cols);

            // if rows are the same, check that each col is equal to the last plus one (if not, do vice versa)

            /*
            if (rowset.size === 1) {
                perpendiculardirection = 1;
                for (let i = 0; i < (cols.length - 1); i++) {
                    let diff = cols[i + 1] - cols[i];
                    if (diff === 1) {
                        firstcheckvalid = true;
                    } else {
                        firstcheckvalid = false;
                        break;
                    }
                }
            } else if (colset.size === 1) {
                for (let i = 0; i < (rows.length - 1); i++) {
                    let diff = rows[i + 1] - rows[i];
                    if (diff === 1) {
                        firstcheckvalid = true;
                    } else {
                        firstcheckvalid = false;
                        break;
                    }
                }
            }
            */
            // if either all row values are equal or col values are equal, then first check is valid
            if (rowset.size === 1) {
                perpendiculardirection = 1;
                firstcheckvalid = true;
            } else if (colset.size === 1) {
                firstcheckvalid = true;
            }

        } else {
            firstcheckvalid = true;
        }


        // second check: check for empty cells within main word (I don't think it's needed for otherwords...?)
        // start with beginning of the word, check that the next cell is either same or +1 for row or col

        let secondcheckvalid = false;

        if (firstcheckvalid) {

            let cells = this.players[this.turn].mainwordcells;
            if (cells.length > 1) {

                if (cells[0].pos[0] === cells[1].pos[0]) {
                    perpendiculardirection = 1;
                }

                for (let i = 0; i < (cells.length - 1); i++) {
                    let diff = cells[i + 1].pos[perpendiculardirection] - cells[i].pos[perpendiculardirection];
                    if (diff === 1) {
                        secondcheckvalid = true;
                    } else {
                        secondcheckvalid = false;
                        break;
                    }
                }
            } else {
                secondcheckvalid = false;
            }

        }


        // third check: unless it is the very first play in the game (which needs to be played on the star), check that at least one of the tilesInPlay has adjacent_used.vertical or adjacent_used.horizontal
        let thirdcheckvalid = false;

        let scores = this.players.map((player) => {
            return player.score;
        })

        let setofscores = new Set(scores);

        if (setofscores.size === 1 && setofscores.has(0)) {
            // check that one of the cells is type '*'
            this.players[this.turn].tilesInPlay.forEach((inplay) => {
                if (inplay.cell.type === '*') {
                    thirdcheckvalid = true;
                }
            })
        } else {
            this.players[this.turn].tilesInPlay.forEach((inplay) => {
                if (inplay.adjacent_used.vertical.length > 0 || inplay.adjacent_used.horizontal.length > 0) {
                    thirdcheckvalid = true;
                }
            })
        }

        // should only return true if both checks are true
        let allchecksvalid = firstcheckvalid && secondcheckvalid && thirdcheckvalid;
        return allchecksvalid;

    }


    sortCellsToMakeWord(cellArry) {
        for (let i = 0; i < 2; i++) {
            cellArry.sort((a, b) => {
                if (a.pos[i] < b.pos[i]) {
                    return -1;
                } else if (a.pos[i] > b.pos[i]) {
                    return 1;
                } else {
                    return 0;
                }
            })
            console.log(`sort at ${i}: `, cellArry);
        }
    }

    compileWordsInPlay(tilesInPlay) {

        // first reset mainword and otherwords
        this.players[this.turn].mainword = '';
        this.players[this.turn].otherwords = [];

        this.players[this.turn].mainwordcells = [];
        //this.players[this.turn].otherwordscells = [];


        // take the array of tilesInPlay with adjacent used tiles stored
        // first determines the direction the player is playing from comparing the row positions of the first two tiles

        let mainword = new Set();

        let allwords = [];

        if (tilesInPlay.length > 0) {

            let emptyadjacent = false;

            let maindirection = 'vertical';
            let otherdirection = 'horizontal';

            if (tilesInPlay.length > 1) {
                if (tilesInPlay[0].row === tilesInPlay[1].row) {
                    maindirection = 'horizontal';
                    otherdirection = 'vertical';
                }
            } else {
                if ((tilesInPlay[0].adjacent_used.vertical.length < 1) && (tilesInPlay[0].adjacent_used.horizontal.length < 1)) {

                    // there are no words to compile yet
                    emptyadjacent = true;

                } else if (tilesInPlay[0].adjacent_used.vertical.length > 0) {
                    maindirection = 'vertical';
                    otherdirection = 'horizontal';
                } else {
                    maindirection = 'horizontal';
                    otherdirection = 'vertical';
                }
            }


            // if the word is vertical, then it iterates through each tile
            // first adds its adjacent_used.vertical cells to a Set called 'main word'


            if (emptyadjacent === false) {

                tilesInPlay.forEach((tile) => {


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


                    /*
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
                    */

                })

                let mainwordarry = Array.from(mainword);


                // sort by row then by col
                this.sortCellsToMakeWord(mainwordarry);

                this.players[this.turn].mainwordcells = mainwordarry;

                let mainwordarryLetters = mainwordarry.map((cell) => {
                    return cell.tile.letter;
                })

                let mainwordSTR = mainwordarryLetters.join('');
                this.players[this.turn].mainword = mainwordSTR;
                console.log('PLAYERS MAINWORD = ', this.players[this.turn].mainword);

                if (allwords.length > 0) {

                    let allwordssorted = allwords.map((word) => {
                        this.sortCellsToMakeWord(word);
                        return word;
                    })

                    //console.log(allwordssorted);


                    let allwordssortedSTRs = allwordssorted.map((sortedword) => {
                        let letters = sortedword.map((cell) => {
                            return cell.tile.letter;
                        })
                        let wordSTR = letters.join('');
                        return wordSTR;
                    })

                    // switch other word with main word if main direction is actually horizontal instead of default vertical set when only one tile is currently in play
                    if (this.players[this.turn].mainword === '' && allwords.length === 1) {
                        this.players[this.turn].mainword = allwordssortedSTRs[0];
                        this.players[this.turn].otherwords = [];
                    } else {
                        this.players[this.turn].otherwords = allwordssortedSTRs;
                    }


                    console.log('PLAYERS OTHERWORDS = ', this.players[this.turn].otherwords);

                }


                allwords.push(mainwordarry);


            }




        }


        return allwords;

    }



    updatePointsInPlay(wordsInPlay) {

        let totalpoints = 0;

        if (this.players[this.turn].hasvalidplay) {

            if (wordsInPlay.length > 0) {

                wordsInPlay.forEach((wordarry) => {
                    let wordpoints = 0;
                    let dw = 0;
                    let tw = 0

                    wordarry.forEach((cell) => {
                        let points = cell.tile.points;

                        // only include board cell types in calculating total points for inplay (not used) tiles
                        if (cell.tile.inplay) {

                            if (cell.type === 'DW' || cell.type === '*') {
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

                // 50 point bonus for using all tiles in rack during a play
                if (this.players[this.turn].tilesInPlay.length === 7) {
                    totalpoints += 50;
                }

            }

        }


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
        } else {
            tile.inplay = false;
        }

        return tile;
    }


    tileMove(tileid, cellid) {
        // get tile from tileid
        /*
        let tileidsplit = tileid.split('_');
        let tileindex = Number(tileidsplit[1]);
        let tile = this.players[this.turn].rack[tileindex];
        */

        let tile = '';
        this.players[this.turn].rack.forEach((racktile, i) => {
            if (racktile.id === Number(tileid)) {
                //index = i;
                tile = racktile;
            }
        })

        //let tile = this.players[this.turn].rack[index];

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

        // update the rack tile's cell info
        let updatedtile = this.updateRackTile(tile, cellid);

        //let tilesInPlay = this.collectData_inPlayTiles();

        // update tiles in play array
        console.log('updatedtile: ', updatedtile);
        let tilesInPlay = this.updateTilesInPlay(updatedtile);
        // update points in play
        let wordsInPlay = this.compileWordsInPlay(tilesInPlay);
        this.players[this.turn].hasvalidplay = this.isTilePlacementValid();
        this.updatePointsInPlay(wordsInPlay);

    }


    // adds tile to tilesinPlay if it's new on the board
    // updates the info for tile already in tilesinPlay
    // returns updated tilesInPlay arry
    updateTilesInPlay(tile) {

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
        let directions = [{ step: 1 }, { step: -1 }];

        position.forEach((rowORcol, i) => {

            directions.forEach((direction) => {

                if (!(rowORcol === 14 && direction.step === 1) && !(rowORcol === 0 && direction.step === -1)) {
                    let steps = direction.step;
                    let checknext = true;
                    while (checknext) {

                        let nextcell = '';
                        let pushTo = '';
                        if (i === 0) {

                            nextcell = this.board.cellsAll[position[i] + steps][col];
                            pushTo = in_play.adjacent_used.vertical;
                        } else {
                            nextcell = this.board.cellsAll[row][position[i] + steps];
                            pushTo = in_play.adjacent_used.horizontal;
                        }

                        if (nextcell !== undefined) {
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
                        } else {
                            checknext = false;
                        }

                    }
                }
            })

        });

        // checks for tile in tilesinplay
        let isInArry = false;
        let index = '';
        this.players[this.turn].tilesInPlay.forEach((inplay, i) => {
            if (in_play.tile.id === inplay.tile.id) {
                index = i;
                isInArry = true;
            }
        })
        if (isInArry === false) {
            this.players[this.turn].tilesInPlay.push(in_play);
        } else {
            this.players[this.turn].tilesInPlay[index] = in_play;
        }

        return this.players[this.turn].tilesInPlay;

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

        // update tiles in play array
        let tilesInPlay = this.updateTilesInPlay(tile);
        // update points in play
        let wordsInPlay = this.compileWordsInPlay(tilesInPlay);
        this.players[this.turn].hasvalidplay = this.isTilePlacementValid();
        this.updatePointsInPlay(wordsInPlay);
    }

    readyToStart() {
        if (this.numOfPlayers === this.players.length) {
            this.ready = true;
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
        //tiledrawn.id = `tile_${i}`;

        this.tiles_drawn.push(tiledrawn);
        this.tiles.splice(index, 1);

        return tiledrawn;
    }

    getTileForDemo(letter) {
        let emptyhanded = true;
        let i = 0;
        let matchingtile = '';
        while (emptyhanded) {
            if (this.tiles[i].letter === letter) {
                matchingtile = this.tiles[i];
                this.tiles_drawn.push(matchingtile);
                this.tiles.splice(i, 1);
                emptyhanded = false;
            } else {
                i++;
            }
        }
        return matchingtile;
    }

    distributeTilesToPlayer(player) {
        let n = 7 - player.rack.length;
        let iBlankTile = 5;
        let tiledrawn;

        for (let i = 0; i < n; i++) {

            if (this.demo && i === iBlankTile) {
                if (player.id === 0) {
                    tiledrawn = this.getTileForDemo('-');
                } else {
                    tiledrawn = this.getRandomTile();
                }
            } else {
                tiledrawn = this.getRandomTile();
            }

            player.rack.push(tiledrawn);

        }

    }

    getRandomTile() {
        let index = Math.floor(Math.random() * this.tiles.length);
        let tiledrawn = this.tiles[index];
        this.tiles_drawn.push(tiledrawn);
        this.tiles.splice(index, 1);
        return tiledrawn;
    }

    shuffleRack(player) {
        let array = player.rack;
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
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

// ACTIVE GAMES

let activeGames = [];

function findMatchingGameCode(gameCode) {
    for (let game of activeGames) {
        if (gameCode === game.id) {
            return game;
        }
    }
}

// DICTIONARY API

function checkDef(word) {
    console.log('LOOKING UP ', word);
    let value = '';

    fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=a662cfbc-08de-4c57-afe6-989722d50903`).then((res) => {
        return res.json();
    }).then((res) => {
        //console.log(res);
        if (typeof res[0] === 'string') {
            console.log('Not a valid word');
            value = 'Not a valid word';
            return value;
        } else {
            let firstresult = res[0];
            let shortdef_arry = firstresult.shortdef;
            //console.log(word.toUpperCase());
            shortdef_arry.forEach((def) => {
                //console.log(def);
            })
            value = shortdef_arry[0];
            console.log('value being returned: ', value);
            return value;
        }

    })

    // return value;

}


// SERVER

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

    if (req.url.endsWith('soundFileNames')) {

        let sounds_dir = {};
        sounds_dir.names = fs.readdirSync('./sounds/');
        res.end(JSON.stringify(sounds_dir));
        return;

    }

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

    if (req.url.endsWith('demo')) {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })

        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log('demo request on server');
            let numOfPlayers = parsedBody.numOfPlayers;
            let newGame = new Game(numOfPlayers);
            newGame.demo = true;

            // add words to board using tiles from newGame.tiles before adding players (which distributes tiles from actual remaining tiles to each player)
            newGame.addDemoWordsToBoard();

            newGame.addPlayer(parsedBody.player);
            let playerscore = newGame.demowords[0].score;
            newGame.players[0].updateScore(playerscore);

            for (let n = 2; n <= Number(numOfPlayers); n++) {
                newGame.addPlayer(`Player ${n}`);
                newGame.players[n - 1].updateScore(newGame.demowords[n - 1].score);
            }

            newGame.demowords[3].tiles.forEach((tile) => {
                tile.lastplayed = true;
                newGame.lastplayed.push(tile);
            })

            let lastWordLookUp = newGame.websterLookUp('WORDS');
            console.log(lastWordLookUp);
            lastWordLookUp.then((val) => {
                newGame.lastplayedwords.push(val);
            })

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
            console.log(matchingGame);
            if (matchingGame !== undefined) {
                //let player = new Player(parsedBody.player);
                //matchingGame.players.push(player);
                matchingGame.addPlayer(parsedBody.player);
                /*
                if (matchingGame.readyToStart()) {
                    matchingGame.ready = true;
                };
                */
                res.end(JSON.stringify(matchingGame));

            } else {
                let message = { msg: 'Please enter a valid game code' };
                res.end(JSON.stringify(message));
            }

            return;

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

            if (parsedBody.letter.length === 1 && letters.includes(parsedBody.letter)) {
                let matchingGame = findMatchingGameCode(parsedBody.id);
                //console.log('tilemove found matchingGame: ', matchingGame);

                matchingGame.assignLetterToBlankTile(parsedBody.tileid, parsedBody.letter);

                res.end(JSON.stringify(matchingGame));
            } else {
                let message = { msg: 'Please enter one valid letter' };
                res.end(JSON.stringify(message));
            }

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
            console.log('undo body: ', parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            matchingGame.undo();

            res.end(JSON.stringify(matchingGame));
            return;
        })

        return;
    }

    if (req.url.endsWith('shuffle')) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log('shuffle body: ', parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            let player = matchingGame.players[parsedBody.playerid];
            matchingGame.shuffleRack(player);

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




    if (req.url.startsWith('/sounds/')) {
        res.write(fs.readFileSync('.' + req.url));
        console.log('sound file requested');
        res.end();
        return;
    }

    // /MWlogo.png
    if (req.url.endsWith('MWlogo.png')) {
        res.write(fs.readFileSync('./MWlogo.png'));
        console.log('mwlogo requested');
        res.end();
        return;
    }

    if (req.url.endsWith('redtheme.css')) {
        res.write(fs.readFileSync('./redtheme.css'));
        console.log('red theme is called');
        res.end();
        return;
    }

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


}).listen(port);