class BoardCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnDragOver = this.handleOnDragOver.bind(this);
        this.handleOnDrop = this.handleOnDrop.bind(this);
    }

    handleOnDragOver() {
        
        // TO DO

    }

    handleOnDrop () {

        // TO DO

    }
    
    render() {

        if (this.props.cell.tile !== '') {
            return (
                <Tile tile={this.props.cell.tile} turn={this.props.turn}/>
            )
        } else {

            let id = `${this.props.rowindex}_${this.props.colindex}`;
            let classes = ['cell'];

            let celltype = this.props.cell.type;
            let label = this.props.cell.type;

            if (celltype === '-') {
                classes.push('blank');
            } else if (celltype === '*') {
                classes.push('star');
                label = `<i class="fas fa-star"></i>`;
            } else {
                classes.push(cell.type);
            }

            if (turn) {
                classes.push('live');
            }

            // TO DO: make drag attributes conditional
            return (
                <div id={id} className={classes} onDragOver={this.handleOnDragOver} onDrop={this.handleOnDrop}>
                    {label}
                </div>
            )


        }

        
    }

}