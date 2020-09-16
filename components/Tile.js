class Tile extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {

        let id = this.props.tile.id;
        let classes = ['tile'];

        if (this.props.tile.blank) {
            if (this.props.tile.letter === '-') {
                classes.push('blank-tile');
            } else {
                classes.push('blank-tile-assigned');
            }
        }

        if (this.props.tile.lastplayed) {
            classes.push('lastplayed');
        }
        
        if (this.props.turn && this.props.inplay) {
            classes.push('inplay', 'selectable');
            // draggable = true
            // ondragstart = onDragStart(event)
        }

        // TO DO: add conditional drag attributes
        return (
            <div id={id} className={classes}>
                <span className='letter'>{this.props.tile.letter}</span>
                <span className='ptvalue'>{this.props.tile.points}</span>
            </div>
        )

    }
}