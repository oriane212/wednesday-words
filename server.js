console.log('yo yo yo');

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const alphanumeric = letters.concat(numbers);

function generateCode(length) {
    let code = '';
    for (let i=0; i < length; i++) {
        code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    console.log(code);
    return code;
}




class Board {
    constructor() {
        this.cellsUpperLeft = [
            ['TW', '-', '-', 'DL', '-', '-', '-'],
            ['-', 'DW', '-', '-', '-', 'TL', '-'],
            ['-', '-', 'DW', '-', '-', '-', 'DL'],
            ['DL', '-', '-', 'DW', '-', '-', '-'],
            ['-', '-', '-', '-', 'DW', '-', '-'],
            ['-', 'TL', '-', '-', '-', 'TL', '-'],
            ['-', '-', 'DL', '-', '-', '-', 'DL']
        ]
        this.cellsAll = this.generateFullBoardArray();
    }

    generateFullBoardArray() {
        let lowerLeft = this.cellsUpperLeft.slice();
        lowerLeft.reverse();

        let leftHalf = this.cellsUpperLeft.concat([this.cellsUpperLeft[0]], lowerLeft);

        let full = leftHalf.map((row) => {
            let rowcopy = row.slice();
            rowcopy.reverse();
            let fullRow = row.concat(row[0], rowcopy);
            return fullRow;
        })

        full[7][7] = '*';
        return full;
    }
}





class Player {
    constructor(name){
        this.name = name;
        this.score = 0;
        this.rack = [];
    }

    addToScore(pointsFromPlay) {
        this.score += pointsFromPlay;
    }
}

class Game {
    constructor(player1, numOfPlayers) {
        this.id = generateCode(4);
        this.numOfPlayers = Number(numOfPlayers);
        this.players = [player1];
        this.ready = false;
        this.turn = 0;
        this.testSquareColor = 'red';
        this.board = new Board();
        this.tiles = [];
    }

    readyToStart() {
        if (this.numOfPlayers === this.players.length) {
            return true;
        } else {
            return false;
        }
    }
    
    updateTurn() {
        if (this.turn < this.players.length-1) {
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
    console.log('req: ', req.url);
    console.log("listening on: 3000");

    // TO DO: add stylesheet
    
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
    

    if (req.url.endsWith('start')) {
        let body = '';
        
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            let parsedBody = JSON.parse(body);
            console.log(parsedBody);
            let numOfPlayers = parsedBody.numOfPlayers;
            let player = new Player(parsedBody.player);
            let newGame = new Game(player, numOfPlayers);
            activeGames.push(newGame);
            console.log(activeGames);
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
            console.log(parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.codejoin);
            if (matchingGame !== 'undefined'){
                let player = new Player(parsedBody.player);
                matchingGame.players.push(player);
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
            console.log(parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            
            matchingGame.testSquareColor = parsedBody.testSquareColor;
            console.log('updated matchingGame: ', matchingGame);
            //console.log(activeGames);
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
            console.log(parsedBody);
            let matchingGame = findMatchingGameCode(parsedBody.id);
            
            //matchingGame.testSquareColor = parsedBody.testSquareColor;
            console.log('refresh found matchingGame: ', matchingGame);
            //console.log(activeGames);
            res.end(JSON.stringify(matchingGame));
            return;
        })
        
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
        for (let i=0; i < 10; i++) {
            console.log(i);
        }
        res.end();
    }


}).listen(3000);