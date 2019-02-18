import React, { Component } from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

class Affectations extends Component {
  render() {
    return (
      <div>
        <h2>Affectations</h2>

        <ToolkitProvider
          keyField='idVent'
          data = {this.props.students} 
          columns = {this.props.rtColumns}
          search
          exportCSV
          
        >
          {
            props => (
              <div>
                <ExportCSVButton { ...props.csvProps }>Export CSV</ExportCSVButton>
                <SearchBar { ...props.searchProps } />
                <hr />
                <BootstrapTable
                  striped
                  hover
                  condensed
                  noDataIndication="Pas de données" 
                  pagination={ paginationFactory()}
                  cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) }
                  { ...props.baseProps }
                />
              </div>
            )
          }
        </ToolkitProvider>
      </div>
    );
  }
}

export default Affectations;