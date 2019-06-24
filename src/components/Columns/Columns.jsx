import React, {Component} from 'react';

import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'


class Columns extends Component {

    render() {
        let wishNums = [];
        for (let i = 1; i <= this.props.wishCount; i++) {
            wishNums.push(i);
        }

        return (
            <div>
                <h2>Liaison des données</h2>
                <div id="columnsTable" className="mb-3">
                    <Table striped bordered hover size="sm">
                        <thead>
                        <tr>
                            <th>Colonnes</th>
                            <th>Mode</th>
                            <th>Rang du Voeu</th>
                            <th>Attrait du Module</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            Array.from(this.props.columns.keys()).map((el) => {
                                return <tr key={el}>
                                    <td>{el}</td>
                                    <td>
                                        <Form.Control as="select"
                                                      id={el}
                                                      onChange={this.props.changeMode}
                                                      value={this.props.columns.get(el).state}
                                                      size="sm">
                                            <option value="discard">Ignorer</option>
                                            <option value="wish">Voeu</option>
                                            <option value="appeal">Attrait</option>
                                            <option value="information">Information</option>
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Control as="select"
                                                      id={el}
                                                      onChange={this.props.changeWishNum}
                                                      value={this.props.columns.get(el).wishNum}
                                                      disabled={this.props.columns.get(el).state !== "wish"}
                                                      size="sm">
                                            {
                                              this.props.columns.get(el).wishNum === -1 && <option value={-1}>N/A</option>
                                            }
                                            {
                                              wishNums.map((el) => {
                                                return <option key={el} value={el}>{el}</option>;
                                              })
                                            }
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Control as="select"
                                                      id={el}
                                                      onChange={this.props.changeAppealNum}
                                                      value={this.props.columns.get(el).appealNum}
                                                      disabled={this.props.columns.get(el).state !== "appeal"}
                                                      size="sm">
                                            {
                                              this.props.columns.get(el).appealNum === -1 && <option value={-1}>N/A</option>
                                            }
                                            {
                                              Array.from(this.props.courses.keys()).map((el) => {
                                                return <option key={el} value={el}>{el}</option>;
                                              })
                                            }
                                        </Form.Control>
                                    </td>
                                </tr>
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default Columns;
