# Demo

## Flow

1. Click link for demo on welcome
2. Top of the screen shows a Demo notifcation bar with option to exit the demo and return to welcome section. You and three fake players have already started a game with a few words on the board. It's your turn. You can:
    - hover over interactive elements to see tooltips?
    - shuffle your rack tiles
    - drag & drop tiles onto the board (and see points-in-play being calculated in real time)
    - undo the last drag & drop
    - play/submit word
3. After playing a valid word, you see the board and rack tiles are no longer interactive, it's now the next player's turn, you word appears in 'Last Words Played' and your total score has increased. The screen is faded and the top notification says the demo has ended. You can exit or restart the demo.


## To do

### Demo link
- [x] add link for demo to welcome section
- [x] add 'demo' client request and server response

### Server-side

#### create demo game
- [x] new game with 4 players, user by name as first player
- [ ] add 4 words to the board, add points to each player's score accordingly
- [ ] look up player 4's word w Webster API, set game.lastwordsplayed array to word-def obj(s) played by player 4, and set game.lastplayed to player 4's word

#### other
- [x] add a check for game readiness each time a player is added
- [ ] add demo property to game obj set false?

### Client
- [ ] add tooltips
- [ ] add top notifcation

