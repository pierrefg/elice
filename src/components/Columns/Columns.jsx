import React, {Component} from 'react';

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import Form from 'react-bootstrap/Form'


class Columns extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true
        }
    }

    render() {
        const {open} = this.state;

        let wishNums = [];
        for (let i = 1; i <= this.props.wishCount; i++) {
            wishNums.push(i);
        }

        return (
            <div>
                <h2><span>Colonnes</span>
                    <Button
                        variant="secondary"
                        onClick={() => this.setState({open: !open})}
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
                                    return <tr key={el}>
                                        <td>{el}</td>
                                        <td>
                                            <Form.Control as="select"
                                                          id={el}
                                                          onChange={(e) => this.props.changeMode(e)}
                                                          value={this.props.columns[el].state}
                                                          size="sm">
                                                <option value="display">Afficher</option>
                                                <option value="discard">Ignorer</option>
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control as="select"
                                                          id={el}
                                                          onChange={(e) => this.props.changeWishNum(e)}
                                                          value={this.props.columns[el].wishNum}
                                                          disabled={this.props.columns[el].state === "discard"}
                                                          size="sm">
                                                <option value={-1}>Pas un vœu</option>
                                                {
                                                  wishNums.map((el) => {
                                                    return <option key={el} value={el}>{el}</option>;
                                                  })
                                                }
                                                {
                                                  this.props.columns[el].wishNum === -1 && <option key={this.props.wishCount+1} value={this.props.wishCount+1}>{this.props.wishCount+1}</option>
                                                }
                                            </Form.Control>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </Table>
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default Columns;
