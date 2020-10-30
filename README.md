Wednesday Words
===================================
Remote multiplayer desktop web game

![Player drags a tile from their rack and drops it onto an interactive game board in a multiplayer game](gameplay.gif)

## Play a game!
Using Google Chrome on a desktop, go to [wednesday-words.herokuapp.com](https://wednesday-words.herokuapp.com/).

### Demo 
To just see how gameplay is, try the single player demo! Shuffle your rack tiles, drag and drop tiles onto and across the board, assign a blank tile a letter, undo tile moves to remove last dropped tiles from the board and return them to your rack, and end your turn by playing your word.

### Start
Start a multiplayer game with your name and select the total number of players (2 to 4). A code for your game will be generated. Share the game code with your friends to join. Your game will start when all players have joined :-)

### Join
Join a game that a friend started by entering your name and the game code. 

## Features
- 2 to 4 remote players
- Player dashboard with drag-and-drop tiles, scoreboard, turn status, points-in-play (dynamically calculated with each tile move), and definitions of last word(s) played using Merriam Webster's API
- Live board displays real-time updates to all players
- Sound effects from freesound.org

## Development

- Node.js http server
- JavaScript client
- ES6 Class-based game model
- Merriam Webster's API word definition lookup

### To do

#### refactor
- [ ] React-based UI (in progress)

#### features
- [x] user action: shuffle rack tiles
- [x] user action: exit game w confirm
- [x] sound effects
- [x] demo game for 1 player
- [ ] user action: save/pause game
- [ ] user action: rejoin in-progress game
- [ ] user action: exchange tiles
- [ ] chat widget in player dashboard

#### tests
- [ ] UI component tests
- [ ] server/build test
- [ ] browser testing
 
#### bugs

##### Safari
- [ ] Fix: look and feel of drag and drop
- [ ] Fix: sounds
