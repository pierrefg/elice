import React, {Component} from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {CSVExport, Search} from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Button from 'react-bootstrap/Button';
import cellEditFactory from 'react-bootstrap-table2-editor';

import "./affectations.css"

const {SearchBar} = Search;
const {ExportCSVButton} = CSVExport;

class Affectations extends Component {
    render() {
        return (
            <div>
                <h2>Affectations</h2>

                <ToolkitProvider
                    keyField='idVent'
                    data={this.props.students}
                    columns={this.props.rtColumns}
                    search
                    exportCSV
                >

                    {
                        props => (
                            <div>
                                <SearchBar placeholder="Recherche..." {...props.searchProps} />
                                <div className="float-right">
                                    <Button className="btn-primary mr-2"
                                            onClick={() => this.props.affect()}>Ventiler</Button>
                                    <ExportCSVButton className="btn-primary" {...props.csvProps}>Export
                                        CSV</ExportCSVButton>
                                </div>
                                <hr/>
                                <BootstrapTable
                                    bootstrap4
                                    classes="table-sm"
                                    wrapperClasses="table-responsive"
                                    striped
                                    hover
                                    condensed
                                    noDataIndication="Pas de données"
                                    pagination={paginationFactory({sizePerPage: 10, hideSizePerPage: false})}
                                    cellEdit={cellEditFactory({mode: 'click', blurToSave: true})}
                                    {...props.baseProps}
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
