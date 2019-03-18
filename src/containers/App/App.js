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
      vowNumber: 0,
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

  changeColumnMode(e){
    let value = e.target.value;
    let key = e.target.id;
    let vowNumber = this.state.vowNumber;
    let columns = {...this.state.columns};
    
    // Change from vow type
    if(columns[key].state === "vow"){
      vowNumber--;
      for (var el in columns) {
        if (columns[el].vowNum > columns[key].vowNum)
          columns[el] = {...columns[el], vowNum: columns[el].vowNum-1};      
      }
      columns[key] = {...columns[key], vowNum: -1};
    }
    
    //Change to vow type
    if(value === "vow"){
      vowNumber++;
      columns[key] = {...columns[key], vowNum: vowNumber};
    }
    
    columns[key] = {...columns[key], state: value};
    
    this.setState({
      columns: columns,
      rtColumns: reactTableUtil.columnParser(columns, this.state.groups),
      vowNumber: vowNumber,
      groups: dataHandler.getGroups(this.state.students, columns)
    });
  }
  
  changeColumnVowNum(e){
    let value = parseInt(e.target.value);
    let key = e.target.id;
    let vowNumber = this.state.vowNumber;
    let columns = {...this.state.columns};
    
    if (value === -1) {
      vowNumber--;
      for (var el in columns) {
        if (columns[el].vowNum > columns[key].vowNum)
          columns[el] = {...columns[el], vowNum: columns[el].vowNum-1};      
      }
      columns[key] = {...columns[key], state: "ignore", vowNum: -1};
    } else {
      if (columns[key].state !== "vow") {
          vowNumber++;
          columns[key] = {...columns[key], state: "vow", vowNum: vowNumber};
      }
      
      for (var el in columns) {
        if (columns[el].vowNum === value) {
          columns[el] = {...columns[el], vowNum: columns[key].vowNum};
          break;
        }
      }
      
      columns[key] = {...columns[key], vowNum: value};
    }
    
    this.setState({
      columns: columns,
      rtColumns: reactTableUtil.columnParser(columns, this.state.groups),
      vowNumber: vowNumber,
      groups: dataHandler.getGroups(this.state.students, columns)
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
          <Vows vowNumber={this.state.vowNumber} changeMode = {this.changeColumnMode.bind(this)} changeVowNum = {this.changeColumnVowNum.bind(this)} columns = {this.state.columns}/>
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
