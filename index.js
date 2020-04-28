
let playername = '';
let playerid = '';
let refreshGameInterval = '';
let gameInProgress = false;
let alert = false;
let modal = false;
let blanktileid = '';
let dropzoneid = '';

let currentGame = {};

document.addEventListener('click', (e) => {

    if (e.target.id == 'testsquare') {

        console.log(e.target);
        console.log("testsquare clicked");
        const colors = ["green", "orange", "black", "gray"];
        let i = Math.floor(Math.random() * Math.floor(colors.length));
        let color = colors[i];
        console.log('randomly picked color: ', color);

        let request = new Request('testsquare', {
            method: 'POST',
            body: ` { 
                "id": "${currentGame.id}",
                "testSquareColor": "${color}" 
            }`

        });

        fetch(request).then((res) => {
            return res.json();
        }).then((res) => {

            // update current game to match res from server
            currentGame = res;
            console.log('currentGame updated to match latest game state from server: ', currentGame);
            e.target.style.cssText = `background-color: ${currentGame.testSquareColor}`;
        })


    } else if (e.target.id == 'join') {

        console.log('join clicked');
        const input_name = document.getElementById('namejoin').value;
        const input_codejoin = document.getElementById('codejoin').value;
        console.log(input_name, input_codejoin);

        playername = input_name;

        let request = new Request('join', {
            method: 'POST',
            body: `{
                "player": "${input_name}",
                "codejoin": "${input_codejoin}"
            }`
        });

        // TODO: add condition if join response is `game code error`

        fetch(request).then((res) => {
            return res.json();
        }).then((res) => {

            //currentGame = res;
            let serverGame2 = res;
            currentGame = Object.assign({}, serverGame2);

            for (let player of currentGame.players) {
                if (playername === player.name) {
                    playerid = player.id;
                }
            }

            refreshGameInterval = setInterval(refreshGame, 1000, currentGame);

        })

    } else if (e.target.id == 'start') {

        console.log('start clicked!');
        const input_name = document.getElementById('namestart').value;
        const select_numOfPlayers = document.getElementById('numOfPlayers').value;
        console.log(input_name, select_numOfPlayers);

        playername = input_name;

        // request to new game route with name as parameter
        let request1 = new Request('start', {
            method: 'POST',
            body: `{
                "player": "${input_name}",
                "numOfPlayers": "${select_numOfPlayers}" 
            }`
        });

        fetch(request1).then((res) => {
            return res.json();
        }).then((res) => {
            console.log('res: ', res);

            //currentGame = res;
            let serverGame2 = res;
            currentGame = Object.assign({}, serverGame2);


            for (let player of currentGame.players) {
                if (playername === player.name) {
                    playerid = player.id;
                }
            }
            refreshGameInterval = setInterval(refreshGame, 1000, currentGame);

        })

    } else if (e.target.classList.contains('tile') || e.target.classList.contains('letter') || e.target.classList.contains('ptvalue')) {
        console.log('tile clicked');

    } else if ((e.target.id === 'done' && e.target.classList.contains('selectable')) || (e.target.parentNode.classList.contains('selectable') && e.target.classList.contains('fa-play')) || (e.target.parentNode.parentNode.classList.contains('selectable') && e.target.parentNode.classList.contains('fa-play'))) {

        console.log('end turn clicked');
        let request = new Request('endturn', {
            method: 'POST',
            body: `{
                "id": "${currentGame.id}"
            }`
        });

        fetch(request).then((res) => {
            return res.json();
        }).then((res) => {
            //console.log('res: ', res);
            //currentGame = res;
            let serverGame2 = res;
            currentGame = Object.assign({}, serverGame2);
        })


    } else if (e.target.id === 'blanklettersubmit') {

        console.log('blanklettersubmit: ', e.target, blanktileid);
        blankTileSubmit(blanktileid);
        

    } else if (e.target.id === 'blanklettercancel') {

        console.log('blanklettercancel: ', e.target);
        modal = false;
        

    } else if ((e.target.id === 'undo' && e.target.classList.contains('selectable')) || (e.target.parentNode.classList.contains('selectable') && e.target.classList.contains('fa-undo')) || (e.target.parentNode.parentNode.classList.contains('selectable') && e.target.parentNode.classList.contains('fa-undo'))) {

        console.log('undo clicked');
        let request = new Request('undo', {
            method: 'POST',
            body: `{
                "id": "${currentGame.id}"
            }`
        });

        fetch(request).then((res) => {
            return res.json();
        }).then((res) => {
            //console.log('res: ', res);
            //currentGame = res;
            let serverGame2 = res;
            currentGame = Object.assign({}, serverGame2);
        })

    } else if (e.target.id === 'name') {
        if (alert) {
            alert = false;
            console.log('alert set to false');
        } else {
            alert = true;
            console.log('alert set to true');
        }
        
    } else {
        console.log(e.target);
    }
})

function render(name) {
    let container = document.createElement('div');
    container.innerHTML = name;
    return container;
}


function createPlayerList(currentGame) {

    let div = document.createElement('div');

    let playerlist = document.createElement('div');
    playerlist.setAttribute('id', 'playerlist');


    let header = document.createElement('header');

    let h3 = document.createElement('h3');
    h3.innerHTML = `Players joining...`;

    /*
    let pointsInPlay = document.createElement('h4');

    let undoPlay = document.createElement('div');
    undoPlay.setAttribute('id', 'undo');
    undoPlay.innerHTML = `<i class="fas fa-undo"></i>`;

    let doneplaying = document.createElement('div');
    doneplaying.setAttribute('id', 'done');
    doneplaying.innerHTML = `<i class="fas fa-play"></i>`;

    if (gameInProgress && playerid === currentGame.turn) {
        doneplaying.classList.add('selectable');
        pointsInPlay.innerHTML = `${currentGame.players[playerid].pointsInPlay}`;
        
        if (currentGame.players[playerid].tilesInPlay.length > 0) {
            undoPlay.classList.add('selectable');
        }

    } else {
        undoPlay.classList.add('disabled');
        doneplaying.classList.add('disabled');
    }
    */

    header.append(h3);

    //playerlist.append(header);

    // show each player
    let i = 0;
    let playerdivsContainer = document.createElement('div');
    playerdivsContainer.setAttribute('id', 'playerdivscontainer');

    for (let player of currentGame.players) {

        let playerdiv = document.createElement('div');
        playerdiv.classList.add('playerdiv');

        let scoresheetturn = document.createElement('div');
        scoresheetturn.classList.add('score-sheet-turn');

        // TODO take away unused code here
        if (gameInProgress && i === currentGame.turn && currentGame.ready) {
            playerdiv.classList.add('turn');
            scoresheetturn.innerHTML = `<i class="fas fa-long-arrow-alt-right"></i>`;
            if (player.name === playername) {
                h3.innerHTML = `Your turn:`;
            } else {
                h3.innerHTML = `${player.name}'s turn`;
            }
        }

        let player_name = document.createElement('div');
        player_name.classList.add('score-sheet-name');
        player_name.innerHTML = player.name;

        let playerscore = document.createElement('div');
        playerscore.classList.add('score-sheet-score');
        playerscore.innerHTML = player.score;

        playerdiv.append(scoresheetturn, player_name, playerscore);

        playerdivsContainer.append(playerdiv);

        i++;
    }

    let testsquare = createTestSquare(currentGame.testSquareColor);

    playerlist.append(playerdivsContainer);

    div.append(playerlist);
    //let inner = div.innerHTML;
    //document.body.innerHTML = inner;

    return div;
}


function refreshGame(currentGame) {
    let request = new Request('refresh', {
        method: 'POST',
        body: `{
            "id": "${currentGame.id}"
        }`
    })
    fetch(request).then((res) => {
        return res.json();
    }).then((res) => {

        //let serverGame = res;

        if ( !alert && !modal ) {

            //currentGame = res;
            let serverGame2 = res;
            currentGame = Object.assign({}, serverGame2);
            console.log('currentGame rerendered: ', currentGame);

            let gameContainer = document.getElementById('gameContainer');
            let game = document.createElement('main');
            game.setAttribute('id', 'game');

            let playerDash = playerDashboard(playername, currentGame);

            let boardContainer = document.createElement('section');
            boardContainer.setAttribute('id', "boardcontainer");

            let board = renderBoard(currentGame);

            boardContainer.append(board);

            if (!currentGame.ready) {
                let p = document.createElement('p');
                p.innerHTML = `Waiting for others to join using game code:`;

                let p2 = document.createElement('p');
                p2.setAttribute('id', 'gamecode');
                p2.innerHTML = `${currentGame.id}`;

                let overlay = document.createElement('div');
                overlay.setAttribute('id', 'overlay');

                overlay.append(p, p2);
                boardContainer.append(overlay);
            }

            game.append(playerDash, boardContainer);

            let disposableContainer = document.createElement('div');
            disposableContainer.append(game);

            let disposableContainerInner = disposableContainer.innerHTML;

            gameContainer.innerHTML = disposableContainerInner;

            if (!gameInProgress) {
                if (currentGame.ready) {
                    //clearInterval(refreshGameInterval);
                    //refreshGameInterval = setInterval(refreshGame, 5000, currentGame);
                    gameInProgress = true;
                    //console.log('game in progress now, refresh reset to 5 seconds');
                } else {
                    //console.log("game not in progress, refreshing every second");
                }
            }



        } else {

            console.log('currentGame NO rerendering: ', currentGame);

        }

        //currentGame = res;
        

    })
}

function playerDashboard(playername, currentGame) {

    //let playerInstance = '';

    /*
    for (let player of currentGame.players) {
        if (player.name === playername) {
            playerInstance = player;
            if (player === currentGame.turn_player) {
                
            }
        }
    }
    */

    /*
    if (currentGame.turn_player == playerInstance) {
        console.log("TRUE UTRE");
    } else {
        console.log("FALSEYY");
    }
    console.log(`currentGame.turn_player: `, currentGame.turn_player);
    console.log(`playerInstance: `, playerInstance);
*/

    let playerDash = document.createElement('section');
    playerDash.classList.add('playerDash');

    let header = document.createElement('header');

    let name = document.createElement('h2');
    name.setAttribute('id', 'name');
    name.innerHTML = playername;

    let pointsInPlay = document.createElement('div');
    pointsInPlay.setAttribute('id', 'pointsInPlay');

    let undoPlay = document.createElement('div');
    undoPlay.setAttribute('id', 'undo');
    undoPlay.innerHTML = `<i class="fas fa-undo"></i>`;

    let doneplaying = document.createElement('div');
    doneplaying.setAttribute('id', 'done');
    doneplaying.innerHTML = `<i class="fas fa-play"></i>`;

    if (gameInProgress && playerid === currentGame.turn) {
        pointsInPlay.innerHTML = `${currentGame.players[playerid].pointsInPlay}`;
        doneplaying.classList.add('selectable');

        if (currentGame.players[playerid].tilesInPlay.length > 0) {
            undoPlay.classList.add('selectable');
        }

    } else {
        undoPlay.classList.add('disabled');
        doneplaying.classList.add('disabled');
    }


    let turnstatus = document.createElement('p');
    turnstatus.setAttribute('id', 'turnstatus');

    if (gameInProgress) {
        if (playerid === currentGame.turn) {
            turnstatus.innerHTML = `Your turn:`;
        } else {
            turnstatus.innerHTML = `${currentGame.players[currentGame.turn].name}'s turn`;
        }
    }


    header.append(turnstatus, pointsInPlay, undoPlay, doneplaying);
    //header.append(name);

    let playerList = createPlayerList(currentGame);

    let rack = renderRack(currentGame, playerid);

    playerDash.append(name, rack, header, playerList);

    return playerDash;

}

function renderBoard(currentGame) {
    let container = document.createElement('div');
    container.setAttribute('id', 'board');

    currentGame.board.cellsAll.forEach((row) => {
        let $row = document.createElement('section');
        row.forEach((cell) => {
            let div2 = document.createElement('div');

            if (cell.tile === '') {

                div2.setAttribute('ondragover', 'onDragOver(event);');
                div2.setAttribute('ondrop', `onBoardDrop(event);`)
                div2.setAttribute('id', cell.id);

                if (cell.type === '-') {
                    div2.classList.add('cell', 'blank');
                    div2.innerHTML = cell.type;
                } else if (cell.type === '*') {
                    div2.classList.add('cell', 'star');
                    div2.innerHTML = `<i class="fas fa-star"></i>`;
                } else {
                    div2.classList.add('cell', cell.type);
                    div2.innerHTML = cell.type;
                }

                if (currentGame.turn === playerid) {
                    div2.classList.add('live');
                }

            } else {

                div2 = renderTile(cell.tile);


                if (currentGame.turn === playerid && cell.tile.inplay) {
                    div2.classList.add('inplay');
                    div2.classList.add('selectable');
                    div2.setAttribute('draggable', 'true');
                    div2.setAttribute('ondragstart', 'onDragStart(event);')
                    /*
                    div2.classList.add('selectable');
                    div2.setAttribute('draggable', 'true');
                    div2.setAttribute('ondragstart', 'onDragStart(event);')
                    */

                }
            }
            $row.append(div2);
        })
        container.append($row);
    })
    return container;
}


function blankTileModal(draggableElid) {
    modal = true;
    blanktileid = draggableElid;

    let boardcontainer = document.getElementById('boardcontainer');

    let overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');

    let blankletterinput = document.createElement('input');
    blankletterinput.setAttribute('type', 'text');
    blankletterinput.setAttribute('id', 'blankletterinput');
    blankletterinput.setAttribute('name', 'blankletterinput');
    blankletterinput.setAttribute('placeholder', 'Enter letter for blank tile');
    blankletterinput.setAttribute('aria-placeholder', 'Enter letter for blank tile');

    let btncontainer = document.createElement('div');
    btncontainer.classList.add('btncontainer');

    let btn = document.createElement('button');
    btn.setAttribute('id', 'blanklettercancel');
    btn.innerHTML = 'Cancel';

    let btn2 = document.createElement('button');
    btn2.setAttribute('id', 'blanklettersubmit');
    btn2.innerHTML = 'OK';

    btncontainer.append(btn, btn2);

    overlay.append(blankletterinput, btncontainer);
    boardcontainer.append(overlay);

}


function blankTileSubmit(blanktileid) {
    const letter = document.getElementById('blankletterinput').value;
    sendLetterToServer(blanktileid, letter.toUpperCase());
    //modal = false;
}


function sendLetterToServer(blanktileid, letter) {
    let request = new Request('assignLetterToBlankTile', {
        method: 'POST',
        body: `{
            "id": "${currentGame.id}",
            "tileid": "${blanktileid}",
            "letter": "${letter}"
        }`
    });

    fetch(request).then((res) => {
        return res.json();
    }).then((res) => {

        if (Object.keys(res).length === 1) {

            let invalidletter = document.createElement('div');
            invalidletter.setAttribute('id', 'invalidmsg');
            invalidletter.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${res.msg}`;

            let overlay = document.getElementById('overlay');
            overlay.append(invalidletter);

        } else {
            modal = false;
            //currentGame = res;
            let serverGame2 = res;
            currentGame = Object.assign({}, serverGame2);
            sendTileMoveToServer(blanktileid, dropzoneid);
        }
    }).catch((error) => {
        console.error('Error:', error);
        
        
      });
}

function renderRack(currentGame, playerid) {
    let rack = document.createElement('div');
    rack.classList.add('rack');
    /* for now, do not allow dropping onto rack */
    //rack.setAttribute('ondragover', 'onDragOver(event);');
    //rack.setAttribute('ondrop', `onRackDrop(event);`)

    currentGame.players[playerid].rack.forEach((tile) => {

        if (tile.inplay === false) {

            let div = renderTile(tile);

            if (currentGame.turn === playerid) {
                div.classList.add('selectable');
                div.setAttribute('draggable', 'true');
                div.setAttribute('ondragstart', 'onDragStart(event);')
            }

            rack.append(div);

        }


    })

    return rack;
}

function renderTile(tile) {

    let div = document.createElement('div');
    div.classList.add('tile');
    div.setAttribute('id', tile.id);

    let letter = document.createElement('span');
    letter.classList.add('letter');

    let ptvalue = document.createElement('span');
    ptvalue.classList.add('ptvalue');

    if (tile.letter === '-') {
        div.classList.add('blank-tile');
    }

    if (tile.highlight) {
        div.classList.add('highlight');
    }

    letter.innerHTML = tile.letter;
    ptvalue.innerHTML = tile.points;

    div.append(letter, ptvalue);

    return div;

}

function createTestSquare(tsc) {
    let testsquare = document.createElement('div');
    testsquare.setAttribute('id', 'testsquare');
    testsquare.style.cssText = `background-color: ${tsc}`;
    return testsquare;
}

function selected(target) {
    target.classList.add('selected');
}

function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onBoardDrop(event) {
    const id = event.dataTransfer.getData('text');
    const draggableEl = document.getElementById(id);
    let dropzone = event.target;

    if (dropzone.classList.contains('fa-star') || dropzone.parentNode.classList.contains('fa-star')) {
        let starcell = document.querySelector('div.star');
        console.log(starcell);
        dropzone = starcell;
        //starcell.parentNode.replaceChild(draggableEl, starcell);
    }


    dropzone.parentNode.replaceChild(draggableEl, dropzone);
    /*
    draggableEl.classList.remove('selectable');
    draggableEl.classList.add('inplay');
    draggableEl.setAttribute('draggable', 'false');
    */

    /*else {
        
    }*/
        
    

    if (draggableEl.classList.contains('blank-tile')) {
        dropzoneid = dropzone.id;
        blankTileModal(draggableEl.id);
    } else {
        sendTileMoveToServer(draggableEl.id, dropzone.id);
    }

    event.dataTransfer.clearData();


}

/*
** doesn't work properly yet so for now, do not allow

function onRackDrop(event) {

    const id = event.dataTransfer.getData('text');
    const draggableEl = document.getElementById(id);
    let dropzone = event.target;

    dropzone.append(draggableEl);

    sendTileMoveToServer(draggableEl.id, dropzone.id);
    event.dataTransfer.clearData();
    

}
*/

// // // TODO: fix tile move from board back to rack
// maybe need to add cell property to Tile?

function sendTileMoveToServer(tileid, cellid) {

    let request = new Request('tilemove', {
        method: 'POST',
        body: `{
            "id": "${currentGame.id}",
            "tileid": "${tileid}",
            "cellid": "${cellid}"
        }`
    });

    fetch(request).then((res) => {
        return res.json();
    }).then((res) => {
        //currentGame = res;
        let serverGame2 = res;
        currentGame = Object.assign({}, serverGame2);
    })

}

/*
    Notes

    Key info a player needs...
        - waiting for players to join:
            - game code
            - status (waiting, which players have joined, etc.)
            - board (greyed out behind status div)
            - empty rack
        - during game:
            - list of players and scores
            - status / whose turn it is
            - interactive rack of tiles
            - interactive board
            - play button
    Key player actions...
        - start or join a game
        - enter a word on the board
            - place a tile from rack on board?
            - select a tile and type word? (would need to check that word uses only letters from rack)

    Key automatic game actions...
        - calculate scores
        - distribute tiles
        - update turn (color coded background, with noise, and indicator next to name; )
        - store all words currently on the board
            - option 1: changes div class from cell to tile and updates label AFTER calculating score?
                - but what if player doesn't want to play that word after placing it on the board? you'd have to temporarily store the cells until the word is played.
            - option 2: create another board of empty tiles instead of cells all with a z-index lower than the board cells?
                - when a tile is placed, the z-index for the empty tile is set higher to hide the board cell from view, and the tile is updated to be the tile from the rack.
                - both boards would need to be absolutely postioned?
                - would keep a record of each position on the board (cell and tile), compared to option 1, but is it necessary?


    Flow for player turn:
        1. drag tile to board cell
        2. send new 'rackTileOnBoard' request to server that will rackTileOnBoard(tileid, boardcellid);
        3. player hits 'doneplaying' button, sending 'endturn' request
            - endturn first adds the points in plays to players score
            - then updates the inplay tiles in players rack to be used and no longer in play, and then removes each of those tiles from the rack.
            - more tiles are distributed to the player
            - the game's turn status is updated


    Before playing,
    - rackTileOnBoard actions should be undoable in case player makes a mistake
    - enter button should work for starting and joining game



    *** reminder: make only tiles on board that are currently from player's rack (during player's turn) draggable. Once the player is done taking their turn, tiles should no longer be draggable.


    *** bugs:
    FIXED - tiles are not separate instances - if 2 players have tiles with the same letters, they have literally the same tile and it gets updated for both!!
        - need to generate an array of arrays of separate letter instances, either upfront, or as game is played?

    FIXED - first tile dropped is fine, for both players. then the second letter dropped results in the first tile showing in both spots on the board, AND the two tiles back in the players rack.

*/