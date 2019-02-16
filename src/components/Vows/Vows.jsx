import React, { Component } from 'react';

class Vows extends Component {
    render() {
        return (
        <div>
            <h2> Voeux </h2>

            Combien de voeux possibles ?
            {console.log(this.props.vows)}
            <button onClick={() => this.props.changeVowsNumber(false)}>-</button>
            {this.props.vows.length}
            <button onClick={() => this.props.changeVowsNumber(true)}>+</button>
            <br />
            <select>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
            </select>
        </div>
        );
    }
}

export default Vows;