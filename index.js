
let playername = '';
let currentGame = '';
let refreshGameInterval = '';

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

            currentGame = res;
            //createPlayerList(currentGame);
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

            currentGame = res;
            //createPlayerList(currentGame);
            refreshGameInterval = setInterval(refreshGame, 1000, currentGame);

        })



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

    
    let h3 = document.createElement('h3');
    //h3.innerHTML = `Playing`;
    

    playerlist.append(h3);

    // show each player
    let i = 0;
    for (let player of currentGame.players) {

        let playerdiv = document.createElement('div');
        playerdiv.classList.add('playerdiv');

        //let playerturn = document.createElement('div');

        if (i === currentGame.turn && currentGame.ready) {
            /*
            playerturn.setAttribute('id','turn');
            playerturn.innerHTML = `<i class="fas fa-long-arrow-alt-right"></i>`;
            */
           playerdiv.classList.add('turn');
           if (player.name === playername) {
            h3.innerHTML = `Your turn`;
           } else {
            h3.innerHTML = `${player.name}'s turn`;
           }
        }

        let player_name = document.createElement('div');
        player_name.innerHTML = player.name;
        /*
        if (player.name === playername) {
            player_name.innerHTML = 'You';
        } else {
            player_name.innerHTML = player.name;
        }
        */
        
        let playerscore = document.createElement('div');
        playerscore.innerHTML = player.score;

        playerdiv.append(player_name, playerscore);

        playerlist.append(playerdiv);

        i++;
    }

    let testsquare = createTestSquare(currentGame.testSquareColor);

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
        currentGame = res;
        console.log('currentGame: ', currentGame);

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
            p.innerHTML = `Game code: ${currentGame.id}`;

            let p2 = document.createElement('p');
            p2.innerHTML = `Waiting for players to join...`;

            let status = document.createElement('div');
            status.setAttribute('id', 'status');

            status.append(p, p2);
            boardContainer.append(status);
        }

        game.append(playerDash, boardContainer);

        let disposableContainer = document.createElement('div');
        disposableContainer.append(game);

        let disposableContainerInner = disposableContainer.innerHTML;

        gameContainer.innerHTML = disposableContainerInner;

        console.log("refreshed!")
    })
}

function playerDashboard(playername, currentGame) {

    let playerInstance = '';
    for (let player of currentGame.players) {
        if (player.name === playername) {
            playerInstance = player;
        }
    }

    let playerDash = document.createElement('section');
    playerDash.classList.add('playerDash');

    let name = document.createElement('h2');
    name.innerHTML = playername;

    let playerList = createPlayerList(currentGame);

    let rack = renderRack(playerInstance);

    playerDash.append(name, rack, playerList);

    return playerDash;

}

function renderBoard(currentGame) {
    let container = document.createElement('div');
    container.setAttribute('id', 'board');

    currentGame.board.cellsAll.forEach((row) => {
        let $row = document.createElement('section');
        row.forEach((cell) => {
            let div2 = document.createElement('div');
            div2.setAttribute('id', cell.id);
            if (cell.tile === '') {
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
            } else {
                div2.classList.add('tile');
                if (tile.letter === '-') {
                    div2.classList.add('blank-tile');
                }
                div2.innerHTML = cell.tile.letter;
                // TODO: add point value text
            }
            $row.append(div2);
        })
        container.append($row);
    })
    return container;
}

function renderRack(playerInstance) {
    let rack = document.createElement('div');
    rack.classList.add('rack');

    playerInstance.rack.forEach((tile) => {
        let div = document.createElement('div');
        div.classList.add('tile');
        if (tile.letter === '-') {
            div.classList.add('blank-tile');
        }
        div.innerHTML = tile.letter;
        rack.append(div);
    })

    return rack;
}


function createTestSquare(tsc) {
    let testsquare = document.createElement('div');
    testsquare.setAttribute('id', 'testsquare');
    testsquare.style.cssText = `background-color: ${tsc}`;
    return testsquare;
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

*/