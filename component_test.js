'use strict';

const e = React.createElement;

class Title extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
        return (
            <h1>Friday Words</h1>
        )

    }
  }

const reactTest = document.getElementById('react_test');
ReactDOM.render(e(Title), reactTest);