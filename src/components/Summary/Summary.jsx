import React, {Component} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import "./summary.css"

class Summary extends Component {
    render() {
        let autoStudentCount = this.props.studentCount - this.props.manualStudentCount;

        return (
            <div>
                <h2>3. Récapitulatif</h2>

                <Row>
                    <Col md="6">
                        <Table borderless>
                            <tbody>
                                <tr>
                                    <td>Nombre d'étudiants au total : </td>
                                    <td>{this.props.studentCount}</td>
                                </tr>
                                <tr>
                                    <td>Nombre de places minimales : </td>
                                    <td>{this.props.minPlaces}</td>
                                </tr>
                                <tr>
                                    <td>Nombre de places maximales : </td>
                                    <td>{this.props.maxPlaces}</td>
                                </tr>
                                <tr>
                                    <td>Nombre de places réservées : </td>
                                    <td>{this.props.reservedPlaces}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>

                    <Col md="6">
                        <Table borderless>
                            <tbody>
                            <tr>
                                <td>Étudiants pour affect. auto. : </td>
                                <td>{autoStudentCount}</td>
                            </tr>
                            <tr>
                                <td>Places min. pour affect. auto. : </td>
                                <td className={this.props.autoMinPlaces > autoStudentCount ? "text-danger" : "text-success"}>
                                    {this.props.autoMinPlaces}
                                </td>
                            </tr>
                            <tr>
                                <td>Places max. pour affect. auto. : </td>
                                <td className={autoStudentCount > this.props.autoMaxPlaces ? "text-danger" : "text-success"}>
                                    {this.props.autoMaxPlaces}
                                </td>
                            </tr>
                            <tr>
                                <td>Étudiants en affect. manuelle : </td>
                                <td>{this.props.manualStudentCount}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Summary;