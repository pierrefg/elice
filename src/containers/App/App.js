import React, {Component} from 'react';
import './App.css';

import Wishes from '../../components/Wishes/Wishes'
import Groups from '../../components/Groups/Groups'
import Affectations from '../../components/Affectations/Affectations'
import dataHandler from '../../services/dataHandler'
import reactTableUtil from '../../services/reactTableUtil'

import CSVReader from 'react-csv-reader'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import {Col, Row} from 'react-bootstrap'

class App extends Component {
    constructor() {
        super();

        this.state = {
            wishCount: 0,
            columns: [],
            groups: [],
            students: [],
            rtColumns: [{dataField: 'idVent', text: 'Vide'}]
        };
    }

    handleData(data) {
        data = dataHandler.preProcess(data);
        data = dataHandler.createIds(data);
        let cols = dataHandler.getColumns(data);

        this.setState({
            columns: cols,
            groups: [],
            students: data,
            rtColumns: reactTableUtil.columnParser(cols, this.state.groups)
        });
    }

    handleDataError(e) {
        console.log(e);
    }

    affect() {
        let data = dataHandler.affect(this.state.students, this.state.groups);
        this.setState({students: data});
    }

    changeColumnMode(e) {
        let value = e.target.value;
        let key = e.target.id;
        let wishCount = this.state.wishCount;
        let columns = {...this.state.columns};

        // Change from wish type
        if (columns[key].state === "wish") {
            wishCount--;
            for (let el in columns) {
                if (columns[el].wishNum > columns[key].wishNum)
                    columns[el] = {...columns[el], wishNum: columns[el].wishNum - 1};
            }
            columns[key] = {...columns[key], wishNum: -1};
        }

        //Change to wish type
        if (value === "wish") {
            wishCount++;
            columns[key] = {...columns[key], wishNum: wishCount};
        }

        columns[key] = {...columns[key], state: value};

        this.setState({
            columns: columns,
            rtColumns: reactTableUtil.columnParser(columns, this.state.groups),
            wishCount: wishCount,
            groups: dataHandler.getGroups(this.state.students, columns)
        });
    }

    changeColumnWishNum(e) {
        let value = parseInt(e.target.value);
        let key = e.target.id;
        let wishCount = this.state.wishCount;
        let columns = {...this.state.columns};

        if (value === -1) {
            wishCount--;
            for (let el in columns) {
                if (columns[el].wishNum > columns[key].wishNum)
                    columns[el] = {...columns[el], wishNum: columns[el].wishNum - 1};
            }
            columns[key] = {...columns[key], state: "ignore", wishNum: -1};
        } else {
            if (columns[key].state !== "wish") {
                wishCount++;
                columns[key] = {...columns[key], state: "wish", wishNum: wishCount};
            }

            for (let el in columns) {
                if (columns[el].wishNum === value) {
                    columns[el] = {...columns[el], wishNum: columns[key].wishNum};
                    break;
                }
            }

            columns[key] = {...columns[key], wishNum: value};
        }

        this.setState({
            columns: columns,
            rtColumns: reactTableUtil.columnParser(columns, this.state.groups),
            wishCount: wishCount,
            groups: dataHandler.getGroups(this.state.students, columns)
        });
    }

    loadState() {

    }

    saveState() {
        let fileDownload = require('js-file-download');
        let data = encodeURIComponent(JSON.stringify(this.state));
        fileDownload(data, 'state.json');
    }

    render() {
        return (
            <Container fluid={false}>
                <Jumbotron>
                    <h1>Ventilation</h1>
                    <hr/>
                    <CSVReader
                        cssClass="csv-reader-input"
                        label=<span className="mr-1">Fichier CSV à charger : </span>
                    onFileLoaded={this.handleData.bind(this)}
                    onError={this.handleDataError}
                    parserOptions={{header: true, encoding: "UTF-8"}}
                    inputId="limeSurvey"
                    />
                </Jumbotron>
                <Row>
                    <Col>
                        <Wishes wishCount={this.state.wishCount} changeMode={this.changeColumnMode.bind(this)}
                                changeWishNum={this.changeColumnWishNum.bind(this)} columns={this.state.columns}/>
                    </Col>
                    <Col>
                        <Groups groups={this.state.groups} /*loadData = {this.loadData.bind(this)}*//>
                    </Col>
                </Row>
                <hr/>
                <Affectations students={this.state.students} rtColumns={this.state.rtColumns}
                              affect={this.affect.bind(this)}/>
            </Container>
        );
    }
}

export default App;
