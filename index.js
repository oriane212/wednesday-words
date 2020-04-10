

/*
window.onload = () => {
    console.log('hi');
}

const input = [
    {'type': 'text'},
    {}
]

function init() {
    let input_start = document.createElement('input');
    input_start.set
}
*/

function render(name) {
    let container = document.createElement('div');
    container.innerHTML = name;
    return container;
}
/*
let genlink = document.getElementById('generatedlink');
genlink.innerHTML = 'testing testing';

let test = document.createElement('div');
test.innerHTML = 'test123';

document.body.append(test);
*/

//const start = document.getElementById('start');

/*
start.addEventListener('click', () => {
    console.log('clicked!');
    const input_name = document.getElementById('namestart').value;
    console.log(input_name);
    // request to new game route with name as parameter
    let request1 = new Request('start', { method: 'POST', body: `{"player1": "${input_name}" }` });
    fetch(request1).then((res) => {
        return res.json();
    }).then((res) => {

        let div = document.createElement('div');
        let h2 = document.createElement('h2');
        h2.innerText = `Hi ${res.player1.name}`;
        let p = document.createElement('p');
        p.innerText = `Game code: ${res.id}`;

        let testsquare = createTestSquare();

        div.append(h2, p, testsquare);
        let inner = div.innerHTML;
        document.body.innerHTML = inner;
        console.log(res);
    })
    // server responds with game id
    // request to join game
    // server responds with game 
})
*/


let currentGame = '';

document.addEventListener('click', (e) => {

    if (e.target.id == 'testsquare') {

        console.log(e.target);
        console.log("testsquare clicked");
        const colors = ["red", "green", "blue", "orange", "black", "gray"];
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

            // TODO: this is all a repeat of what start renders. create a function for both.

            currentGame = res;

            let playerlist = document.createElement('div');
            playerlist.setAttribute('id', 'playerlist');

            let div = document.createElement('div');
            /*
            let h2 = document.createElement('h2');
            h2.setAttribute('id', 'player1');
            let h2_2 = document.createElement('h2');
            h2_2.setAttribute('id', 'player2');

            h2.innerText = `Player 1: ${currentGame.player1.name}`;
            h2_2.innerText = `Player 2: ${currentGame.player2.name}`;
            */

            let p = document.createElement('p');

            p.innerText = `Game code: ${currentGame.id}`;

            //let testsquare = createTestSquare(res.testSquareColor);
            let testsquare = createTestSquare(currentGame.testSquareColor);

            div.append(playerlist, p, testsquare);
            let inner = div.innerHTML;
            document.body.innerHTML = inner;

            refreshGameInterval = setInterval(refreshGame, 2000);

        })

    } else if (e.target.id == 'start') {

        console.log('start clicked!');
        const input_name = document.getElementById('namestart').value;
        const select_numOfPlayers = document.getElementById('numOfPlayers').value;
        console.log(input_name, select_numOfPlayers);

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

            // save active game to global current game
            currentGame = res;

            let playerlist = document.createElement('div');
            playerlist.setAttribute('id', 'playerlist');

            let div = document.createElement('div');
            /*
            let h2 = document.createElement('h2');
            h2.setAttribute('id', 'player1');
            let h2_2 = document.createElement('h2');
            h2_2.setAttribute('id', 'player2');

            h2.innerText = `Player 1: ${currentGame.player1.name}`;
            if (currentGame.player2 !== '') {
                h2_2.innerText = `Player 2: ${currentGame.player1.name}`;
            } else {
                h2_2.innerText = `Player 2: (status...)`;
            }
            */
            let p = document.createElement('p');

            p.innerText = `Game code: ${currentGame.id}`;

            //let testsquare = createTestSquare(res.testSquareColor);
            let testsquare = createTestSquare(currentGame.testSquareColor);

            div.append(playerlist, p, testsquare);
            let inner = div.innerHTML;
            document.body.innerHTML = inner;

            refreshGameInterval = setInterval(refreshGame, 2000);

        })



    }
})

function refreshGame() {
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

        let playerlist = document.getElementById('playerlist');

        playerlist.innerHTML = '';

        // show each player
        for (let player of currentGame.players) {

            let playertext = document.createElement('p');
            playertext.innerHTML = `Player: ${player.name}`;
            playerlist.append(playertext);
        }

        let status = document.createElement('div');
        status.setAttribute('id', 'status');

        if (currentGame.ready) {
            status.innerHTML = `All players have joined!`
        } else {
            status.innerHTML = `Waiting for players to join...`
        }

        playerlist.append(status);

        let testsquare = document.getElementById('testsquare');
        testsquare.style.cssText = `background-color: ${currentGame.testSquareColor}`;

        console.log("refreshed!")
    })
}

function sayHi() {
    console.log('hello hello helllo');
}

function createTestSquare(tsc) {
    let testsquare = document.createElement('div');
    testsquare.setAttribute('id', 'testsquare');
    testsquare.style.cssText = `background-color: ${tsc}`;
    return testsquare;
}

let refreshGameInterval = '';