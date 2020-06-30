class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { game: '' };

        this.checkServer = this.checkServer.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(
            () => this.checkServer(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    checkServer() {

        let request = new Request('refresh', {
            method: 'POST',
            body: `{
                "id": "${this.props.gameID}"
            }`
        })

        fetch(request).then((res) => {
            return res.json();
        }).then((res) => {
            this.setState( { game: res } );
        })

    }

    render() {

        let isPlayerTurn = (this.state.game.turn === this.props.playerID);

        return (
            <div id='gameContainer'>
                <Dashboard player={this.props.playerID} turn={isPlayerTurn} activeGame={this.state.game} />
                <Board turn={isPlayerTurn} activeBoard={this.state.game} />
            </div>
            
        )
    }
}