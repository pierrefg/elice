import React, {Component} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import "./summary.css"

class Summary extends Component {
    render() {
        return (
            <div>
                <h2>Récapitulatif</h2>

                <Table borderless>
                    <tbody>
                        <tr>
                            <td>Nombre d'étudiants à répartir : </td>
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
            </div>
        );
    }
}

export default Summary;