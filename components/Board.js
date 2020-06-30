function Board(props) {

    let boardrows = props.game === '' ? '' : props.game.board.cellsAll.map((row, i) => {
        <BoardRow key={i} rowindex={i} row={row} turn={props.turn}/>
    })

    return (
        <section id="boardcontainer">
            <div id="board">
                {boardrows}
            </div>
        </section>
    )

}