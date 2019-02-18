import React, { Component } from 'react';

import ReactTable from "react-table";
import "react-table/react-table.css";

class Affectations extends Component {
  render() {
    return (
      <div className="App">
        <h2>Affectations</h2>
        {//console.log(this.props.students)
        }
        <ReactTable
          data={this.props.students}
          columns={this.props.rtColumns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default Affectations;