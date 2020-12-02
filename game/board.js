
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

module.exports = Board;