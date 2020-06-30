export class Rack {
    constructor(arryOfTiles) {
        this.arryOfTiles = arryOfTiles;
    }

    init() {
        let rack = document.createElement('div');
        rack.classList.add('rack');

        this.arryOfTiles.forEach((tile) => {

            // check for no tiles left in newrack
            if (tile !== 'no tiles left') {

                if (tile.inplay === false) {

                    let div = this.renderTile(tile);

                    if (currentGame.turn === playerid) {
                        div.classList.add('selectable');
                        div.setAttribute('draggable', 'true');
                        div.setAttribute('ondragstart', 'onDragStart(event);')
                    }

                    rack.append(div);

                }

            }

        })
    }

    renderTile(tile) {
        
    }


}