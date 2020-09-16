function Board(props) {

    let turn = false;
        if (this.props.game.turn === this.props.playerID) {
            turn = true;
        }

    let boardrows = props.game === '' ? '' : props.game.board.cellsAll.map((row, i) => {
        <BoardRow key={i} rowindex={i} row={row} turn={turn}/>
    })

    return (
        <section id="boardcontainer">
            <div id="board">
                {boardrows}
            </div>
        </section>
    )

}