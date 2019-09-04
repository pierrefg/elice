import React, {Component} from 'react';

import Table from 'react-bootstrap/Table'
/*import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'*/

class Statistics extends Component {

    /*constructor(props) {
        super(props);

        this.options = {
          title: {
            text: 'Répartition des voeux'
          },
          series: [{
            data: [1, 2, 3]
          }]
        };
    }*/

    render() {
        if (!this.props.statistics || !this.props.statistics.courses)
            return null;

        this.courses = Array.from(this.props.courses.keys());
        return (
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
                                return <tr key={this.courses[el]}>
                                    <td>
                                        {this.courses[el]}
                                    </td>
                                    <td>
                                        {this.props.statistics.courses[el].students}
                                    </td>
                                    <td>
                                        {
                                            Object.keys(this.props.statistics.courses[el]).map((i) => {
                                                return !isNaN(i) && <span key={i}>Nombre de voeux {i} : {this.props.statistics.courses[el][i] || 0}<br/></span>
                                            })
                                        }
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
                {/*
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={this.options}
                  />
                */}
            </div>
        );
    }
}

export default Statistics;
