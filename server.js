let http = require('http');
let fs = require('fs');

//const fetch = require('node-fetch');

const Game = require('./game/game'); 

console.log('yo yo yo');

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let port = process.env.PORT || 3000;


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

/*

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
*/


// SERVER

http.createServer(function (req, res) {

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
            matchingGame.endturn().then(() => {
                res.end(JSON.stringify(matchingGame));
            });

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