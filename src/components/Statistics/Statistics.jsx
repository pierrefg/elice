import React, {Component} from 'react';

import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class Statistics extends Component {

    constructor(props) {
        super(props);

        const options = {
          title: {
            text: 'My chart'
          },
          series: [{
            data: [1, 2, 3]
          }]
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.statistics && this.props.statistics.courses &&
                    <div>
                        <h2>Indicateurs de satisfaction</h2>
                        <h4>Pénalité totale de la ventilation : {this.props.statistics.penalty1}</h4>
                        <div id="columnsTable" className="mb-3">
                            <Table striped bordered hover size="sm">
                                <thead>
                                <tr>
                                    <th>Module</th>
                                    <th>Nombre d'étudiants</th>
                                    <th>Répartition des Voeux</th>
                                    <th>Pénalité relative du module</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    Object.keys(this.props.statistics.courses).map((el) => {
                                        return <tr key={el}>
                                            <td>{el}</td>
                                            <td>
                                                {this.props.statistics.courses[el].students}
                                            </td>
                                            <td>
                                                {this.props.statistics.courses[el][1]},
                                                {this.props.statistics.courses[el][2]},
                                                {this.props.statistics.courses[el][3]}
                                            </td>
                                            <td>
                                                {(this.props.statistics.courses[el].penalty1 * 100 / this.props.statistics.penalty1).toFixed(1)}%
                                            </td>
                                        </tr>
                                    })
                                  }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Statistics;
