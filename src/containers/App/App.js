import React, { Component } from 'react';
import './App.css';

import Vows from '../../components/Vows/Vows'
import Groups from '../../components/Groups/Groups'
import Affectations from '../../components/Affectations/Affectations'
import dataHandler from '../../services/dataHandler'
import reactTableUtil from '../../services/reactTableUtil'

import CSVReader from 'react-csv-reader'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import {Row,Col} from 'react-bootstrap'

const addon = require('../../scripts/Release/addon.node');

class App extends Component {
  constructor(){
    super();

    this.state = {
      vowsNumber: 0,
      columns : [],
      groups : [],
      students : [],
      rtColumns: [{dataField: 'idVent', text: 'Vide'}]
    };
  }

  handleData(data){
    data = dataHandler.preProcess(data);
    data = dataHandler.createIds(data);
    var cols = dataHandler.getColumns(data);

    this.setState({
        columns : cols,
        groups : [],
        students : data,
        rtColumns: reactTableUtil.columnParser(cols, this.state.groups)
    });
  }

  handleDataError(e){
    console.log("error");
  }

  changeValue(e){
    let value = e.target.value;
    let key = e.target.id;
    if(this.state.columns[key].state === "vow"){
      this.state.vowsNumber--;
      this.state.columns[key].vowNum=-1;
    }
    if(value === "vow"){
      this.state.columns[key].vowNum=this.state.vowsNumber;
      this.state.vowsNumber++;
    }
    this.state.columns[key].state=value;
    this.setState({
      columns: this.state.columns,
      rtColumns: reactTableUtil.columnParser(this.state.columns, this.state.groups),
      vowNumber: this.state.vowsNumber,
      groups: dataHandler.getGroups(this.state.students, this.state.columns)
    });
  }

  loadState(){

  }

  saveState(){
    var fileDownload = require('js-file-download');
    var data = encodeURIComponent(JSON.stringify(this.state));
    fileDownload(data, 'state.json');
  }

  render() {
    return (
      <Container>
        <Jumbotron>
        { /*addon.hello()*/ }
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
          <Vows vowNumber={this.state.vowNumber} changeValue = {this.changeValue.bind(this)} columns = {this.state.columns}/>
          </Col><Col>
          <Groups groups = {this.state.groups} /*loadData = {this.loadData.bind(this)}*//>
          </Col>
        </Row>
        <hr/>
        <Affectations students = {this.state.students} rtColumns = {this.state.rtColumns}/>
      </Container>
    );
  }
}

export default App;
