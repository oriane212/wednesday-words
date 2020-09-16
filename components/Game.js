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

        return (
            <div id='gameContainer'>
                <Dashboard playerID={this.props.playerID} game={this.state.game} />
                <Board playerID={this.props.playerID} game={this.state.game} />
            </div>
            
        )
    }
}