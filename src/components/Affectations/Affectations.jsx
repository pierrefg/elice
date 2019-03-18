import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';

import "./affectations.css"

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
                <ExportCSVButton className="btn-primary mb-2" { ...props.csvProps }>Export CSV</ExportCSVButton>
                <SearchBar placeholder="Recherche..." { ...props.searchProps } />
                <hr />
                <BootstrapTable
                  bootstrap4
                  classes="table-sm"
                  wrapperClasses="table-responsive"
                  striped
                  hover
                  condensed
                  noDataIndication="Pas de données" 
                  pagination={ paginationFactory( { sizePerPage: 5, hideSizePerPage: true } ) }
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
