/* 
IconButton is a Font Awesome icon 

Props: 'id' and 'classlist'
State: 'disabled' (t/f)
Methods: 'onClick'
*/

'use strict';

class IconButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { disabled : false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            disabled: !state.disabled
        }));
    }

    render() {
        let classes_arry = ['fas'];
        classes_arry.push(`fa-${this.props.icon}`);

        if (this.state.disabled) {
            classes_arry.push('disabled');
        }

        let classes_str = classes_arry.join(' ');

        return (
            <div id={this.props.icon} onClick={this.handleClick}>
                <i className={classes_str}></i>
            </div>
            
        )
    }
}

const reactTest = document.getElementById('react_test');
let ib = <IconButton icon="undo"/>
ReactDOM.render(ib, reactTest);

