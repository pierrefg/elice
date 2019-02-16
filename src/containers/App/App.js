import React, { Component } from 'react';
import './App.css';

import Groups from '../../components/Groups/Groups'
import Affectations from '../../components/Affectations/Affectations'
import dataHandler from '../../services/dataHandler'

import CSVReader from 'react-csv-reader'


class App extends Component {
  constructor(){
    super();

    this.state = {
      groups : [],
      students : []
    }
  }

  handleData(e){
    console.log(dataHandler)
    let dataHandle = new dataHandler(e);
    dataHandle.getGroups();
    this.setState({
        groups : ["Hilaire","JB","Alex"]
    })
  }

  handleDataError(e){
    console.log("error")
  }

  render() {
    return (
      <div className="App">
        <h1>Ventilation</h1>
        <CSVReader
                cssClass="csv-reader-input"
                label="Select CSV"
                onFileLoaded={this.handleData}
                onError={this.handleDataError}
                parserOptions={{header: true}}
                inputId="limeSurvey"
                inputStyle={{color: 'red'}}
        />
        <Groups groups = {this.state.groups} /*loadData = {this.loadData.bind(this)}*//>
        <Affectations students = {this.state.students} />
      </div>
    );
  }
}

export default App;
