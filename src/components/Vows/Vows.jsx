import React, { Component } from 'react';

import "./vows.css"

class Vows extends Component {
    render() {
        return (
        <div>
            <h2> Voeux </h2>
            <table>
                <thead>
                    <tr>
                        <th>Colonnes</th>
                        <th>Mode</th>
                    </tr>
                </thead>
                <tbody>
            {
                Object.keys(this.props.columns).map((el) => {
                    var temp =  <tr key={el}>
                                    <td>{el}</td>
                                    <td><select id={el} 
                                                onChange={(e) => this.props.changeValue(e)} 
                                                value = {this.props.columns[el].state}>
                                        <option value="default">Defaut</option>
                                        <option value="ignore">Ignorer</option>
                                        <option value="vow">Voeu</option>
                                    </select></td>
                                </tr>
                    return temp
                })
            }
                </tbody>
            </table>
            <br />
            <button>Suite</button>
        </div>
        );
    }
}

export default Vows;