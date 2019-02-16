import React, { Component } from 'react';
import './App.css';

import Vows from '../../components/Vows/Vows'
import Groups from '../../components/Groups/Groups'
import Affectations from '../../components/Affectations/Affectations'
import dataHandler from '../../services/dataHandler'

import CSVReader from 'react-csv-reader'


class App extends Component {
  constructor(){
    super();

    this.state = {
      vows: [],
      columns : [],
      groups : [],
      students : []
    }
  }

  handleData(data){
    let dataH = new dataHandler(data);
    dataH.getGroups();
    var cols = dataH.getColumns();

    this.setState({
        columns : cols,
        groups : ["Hilaire","JB","Alex"],
        students : data
    })
  }

  handleDataError(e){
    console.log("error")
  }

  loadState(){

  }

  saveState(){
    var fileDownload = require('js-file-download');
    var data = encodeURIComponent(JSON.stringify(this.state));
    fileDownload(data, 'state.json');
  }

  changeVowsNumber(add){
    if(add){
      console.log("ici : " + this.state.columns.length)
      if(this.state.columns.length>0){
        console.log("J'ajoute !")
        this.state.vows.push(this.state.columns[0])
        this.setState({
          vows :  this.state.vows
        })
      }
    }else{
      if(this.state.vows.length > 0){
        console.log("Je retire...")
        this.state.vows.pop()
        this.setState({
          vows : this.state.vows
        })
      }
    }
    this.setState();
  }

  render() {
    return (
      <div className="App">
        <h1>Ventilation</h1>
        <span>Load state </span><input type="file"/>
        <span>Save state </span><button onClick={this.saveState.bind(this)}>Save state</button>
        <CSVReader
                cssClass="csv-reader-input"
                //label="Select CSV"
                onFileLoaded={this.handleData.bind(this)}
                onError={this.handleDataError}
                parserOptions={{header: true, encoding: "UTF-8"}}
                inputId="limeSurvey"
        />
        <Vows vows={this.state.vows} changeVowsNumber = {this.changeVowsNumber.bind(this)} columns = {this.state.columns}/>
        <Groups groups = {this.state.groups} /*loadData = {this.loadData.bind(this)}*//>
        <Affectations columns = {this.state.columns} students = {this.state.students} />
      </div>
    );
  }
}

export default App;
