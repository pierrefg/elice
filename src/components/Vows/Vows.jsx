import React, { Component } from 'react';

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'

import "./vows.css"

class Vows extends Component {
    constructor(){
        super();

        this.state = {
            open: true
        }
    }

    render() {
        const { open } = this.state;

        var poss = []
        for(var i=0; i<this.props.vowNumber; i++){
            poss.push(i)
        }

        return (
        <div>
            <h2> <span>Vœux  </span>
            <Button
                variant="secondary"
                onClick={() => this.setState({ open: !open })}
                aria-controls="columnsTable"
                aria-expanded={open}
            >
            Toggle section
            </Button></h2>

            <Collapse in={this.state.open}>
                <div id="columnsTable">
                <Table  striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Colonnes</th>
                            <th>Mode</th>
                            <th>Vœu n°</th>
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
                                                <option value="default">Défaut</option>
                                                <option value="ignore">Ignorer</option>
                                                <option value="vow">Vœu</option>
                                            </select></td>
                                            <td><select id={el} 
                                                        value = {this.props.columns[el].vowNum}>
                                                <option value={-1}>Pas un vœu</option>
                                                {poss.map((el)=>{
                                                    return <option key={el}  value={el}>{el}</option>
                                                })}
                                            </select></td>
                                        </tr>
                            return temp
                        })
                    }
                    </tbody>
                </Table>
                
                <button>Suite</button>
                </div>
            </Collapse>
        </div>
        );
    }
}

export default Vows;