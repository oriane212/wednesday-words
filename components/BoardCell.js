class BoardCell extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {

        if (this.props.cell.tile !== '') {
            return (
                <Tile tile={this.props.cell.tile} />
            )
        } else {

            let id = `${this.props.rowindex}_${this.props.colindex}`;
            let classes = ['cell'];

            let celltype = this.props.cell.type;
            if (celltype === '-')

            return (
                <div id={id} className={classes}>

                </div>
            )


        }

        
    }

}