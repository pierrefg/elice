import React, { Component } from 'react';
import './App.css';

import Vows from '../../components/Vows/Vows'
import Groups from '../../components/Groups/Groups'
import Affectations from '../../components/Affectations/Affectations'
import dataHandler from '../../services/dataHandler'
import reactTableUtil from '../../services/reactTableUtil'

import CSVReader from 'react-csv-reader'
import Container from 'react-bootstrap/Container'


class App extends Component {
  constructor(){
    super();

    this.state = {
      vows: [],
      columns : [],
      groups : [],
      students : [],
      rtColumns: []
    }
  }

  handleData(data){
    let dataH = new dataHandler(data);
    dataH.getGroups();
    var cols = dataH.getColumns();
    console.log(data[0]["Classement_voeux [1]"]);
    this.setState({
        columns : cols,
        groups : ["Hilaire","JB","Alex"],
        students : data
    })
  }

  handleDataError(e){
    console.log("error")
  }

  changeValue(e){
    let value = e.target.value
    let key = e.target.id
    console.log("valeur : "+e.target.value);
    console.log("key : "+e.target.id);
    this.state.columns[key].state=value
    this.setState({
      columns: this.state.columns
    })

    let rTable = new reactTableUtil()
    this.setState({
      rtColumns: rTable.columnParser(this.state.columns)
    })
    
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
        <h1>Ventilation</h1>
        {/*<span>Load state </span><input type="file"/>
        <span>Save state </span><button onClick={this.saveState.bind(this)}>Save state</button>
        */}
        <CSVReader
                cssClass="csv-reader-input"
                //label="Select CSV"
                onFileLoaded={this.handleData.bind(this)}
                onError={this.handleDataError}
                parserOptions={{header: true, encoding: "UTF-8"}}
                inputId="limeSurvey"
        />
        <Vows vows={this.state.vows} changeValue = {this.changeValue.bind(this)} columns = {this.state.columns}/>
        <Groups groups = {this.state.groups} /*loadData = {this.loadData.bind(this)}*//>
        <Affectations students = {this.state.students} rtColumns = {this.state.rtColumns}/>
      </Container>
    );
  }
}

export default App;
