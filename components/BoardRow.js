function BoardRow(props) {
    
    let boardcells = props.row.map((cell, i) => {
        <BoardCell key={i} cell={cell} rowindex={props.rowindex} colindex={i} turn={this.props.turn} />
    })

    return (
        <section>
            {boardcells}
        </section>
    )
}