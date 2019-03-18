import React, { Component } from 'react';

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import Form from 'react-bootstrap/Form'

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

        var vowNums = [];
        for(var i=1; i <= this.props.vowNumber+1; i++){
            vowNums.push(i);
        }

        return (
        <div>
            <h2> <span>Vœux</span>
            <Button
                variant="secondary"
                onClick={() => this.setState({ open: !open })}
                aria-controls="columnsTable"
                aria-expanded={open}
                className="ml-2"
            >
            Afficher/Masquer
            </Button></h2>

            <Collapse in={this.state.open}>
                <div id="columnsTable" className="mb-3">
                <Table striped bordered hover size="sm">
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
                                            <td>
                                                <Form.Control as="select"
                                                              id={el} 
                                                              onChange={(e) => this.props.changeMode(e)}
                                                              value = {this.props.columns[el].state}
                                                              size="sm">
                                                    <option value="default">Défaut</option>
                                                    <option value="ignore">Ignorer</option>
                                                    <option value="vow">Vœu</option>
                                                </Form.Control>
                                            </td>
                                            <td><Form.Control as="select"
                                                              id={el} 
                                                              onChange={(e) => this.props.changeVowNum(e)}
                                                              value = {this.props.columns[el].vowNum}
                                                              size="sm">
                                                    <option value={-1}>Pas un vœu</option>
                                                    {vowNums.map((el)=>{
                                                        return <option key={el} value={el}>{el}</option>;
                                                    })}
                                                </Form.Control>
                                            </td>
                                        </tr>
                            return temp
                        })
                    }
                    </tbody>
                </Table>
                
                <Button variant="secondary">Suite</Button>
                </div>
            </Collapse>
        </div>
        );
    }
}

export default Vows;
