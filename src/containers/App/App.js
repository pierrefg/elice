import React, {Component} from 'react';
import './App.css';

import Columns from '../../components/Columns/Columns'
import Courses from '../../components/Courses/Courses'
import Affectations from '../../components/Affectations/Affectations'
import dataHandler from '../../services/dataHandler'
import reactTableUtil from '../../services/reactTableUtil'
import MunkresApp from '../../lib/munkrespp'

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
            courses: [],
            students: [],
            rtColumns: [{dataField: 'idVent', text: 'Vide'}]
        };
    }

    loadData(data) {
        data = dataHandler.createIds(dataHandler.preProcess(data));
        let columns = dataHandler.extractColumns(data);
        let rtColumns = reactTableUtil.columnParser(columns, []);

        this.setState({
            wishCount: 0,
            columns: columns,
            courses: [],
            students: data,
            rtColumns: rtColumns
        });
    }

    handleDataError(e) {
        console.log(e);
    }

    getStudentsWishMatrix() {
        let wishlist = [];
        for (let studentId in this.state.students) {
            wishlist[studentId] = [];
            for (let col in this.state.students[studentId]) {
                if (this.state.columns[col] !== undefined && this.state.columns[col].wishNum !== -1) {
                    let limeSurveyCourseName = this.state.students[studentId][col];
                    let limeSurveyCourseRank = this.state.columns[col].wishNum;
                    let limeSurveyCourseId = this.state.courses[limeSurveyCourseName].id;
                    wishlist[studentId][limeSurveyCourseId] = limeSurveyCourseRank;
                }
            }
        }
        return wishlist;
    }

    getCourseMinPlaces() {
        let places = [];
        for (let course in this.state.courses) {
            places[this.state.courses[course].id] = this.state.courses[course].nbStudents-10;
        }

        return places;
    }

    getCourseMaxPlaces() {
        let places = [];
        for (let course in this.state.courses) {
            places[this.state.courses[course].id] = this.state.courses[course].nbStudents+10;
        }

        return places;
    }

    affect() {
        let wishMatrix = this.getStudentsWishMatrix();
        let minPlaces = this.getCourseMinPlaces();
        let maxPlaces = this.getCourseMaxPlaces();
        let penalties = [0, 10, 20, 40, 90, 160];

        let assignments = MunkresApp.process(penalties, minPlaces, maxPlaces, wishMatrix, undefined);
        console.log(MunkresApp.analyze_results(assignments, penalties, minPlaces, maxPlaces, wishMatrix, undefined));

        let students = [...this.state.students];


        let courseIndexToName = {};

        for (let course in this.state.courses) {
            courseIndexToName[this.state.courses[course].id+1] = course;
        }

        for (let studentId in assignments) {
            students[studentId] = {...students[studentId], result: courseIndexToName[assignments[studentId]]};
        }

        this.setState({students: students});
    }

    deletedWishNum(state, key) {
        // Not even a wish column ! Nothing to be done
        if (state.columns[key].wishNum === -1) {
            return state;
        }

        state = {...state};
        state.column = {...state.column};

        // Update the current wish columns count
        state.wishCount--;

        // Shift other wish columns' numbers
        for (let el in state.columns) {
            if (state.columns[el].wishNum > state.columns[key].wishNum)
                state.columns[el] = {...state.columns[el], wishNum: state.columns[el].wishNum - 1};
        }

        // Delete the column's wish number
        state.columns[key] = {...state.columns[key], wishNum: -1};

        return state;
    }

    changeColumnMode(e) {
        let value = e.target.value;
        let key = e.target.id;
        let state = {...this.state};
        state.columns = {...state.columns};

        if (value !== "wish") {
            state = this.deletedWishNum(state, key);
        } else if (state.columns[key].wishNum === -1) {
            state.wishCount++;
            state.columns[key] = {...state.columns[key], wishNum: state.wishCount};
        }

        if (value !== "appeal") {
            state.columns[key] = {...state.columns[key], appealNum: -1};
        }

        state.columns[key] = {...state.columns[key], state: value};
        state.courses = dataHandler.getCourses(state.students, state.columns);
        state.rtColumns = reactTableUtil.columnParser(state.columns, state.courses);
        this.setState(state);
    }

    changeColumnWishNum(e) {
        let value = parseInt(e.target.value);
        let key = e.target.id;
        let state = {...this.state};

        if (value === -1) {
            state = this.deletedWishNum(state, key);
        } else {
            if (state.columns[key].wishNum === -1) {
                state.wishCount++;
                state.columns[key] = {...state.columns[key], wishNum: state.wishCount};
            }

            for (let el in state.columns) {
                if (state.columns[el].wishNum === value) {
                    state.columns[el] = {...state.columns[el], wishNum: state.columns[key].wishNum};
                    break;
                }
            }
        }

        state.columns[key] = {...state.columns[key], wishNum: value};
        state.courses = dataHandler.getCourses(state.students, state.columns);
        state.rtColumns = reactTableUtil.columnParser(state.columns, state.courses);
        this.setState(state);
    }

    changeColumnAppealNum(e) {
        let value = e.target.value;
        let key = e.target.id;
        let state = {...this.state};

        if (value === -1) {
            state = this.deletedAppealNum(state, key);
        } else {
            for (let el in state.columns) {
                if (state.columns[el].appealNum === value) {
                    state.columns[el] = {...state.columns[el], appealNum: state.columns[key].appealNum};
                    break;
                }
            }
        }

        state.columns[key] = {...state.columns[key], appealNum: value};
        state.courses = dataHandler.getCourses(state.students, state.columns);
        state.rtColumns = reactTableUtil.columnParser(state.columns, state.courses);
        this.setState(state);
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
                        label={<span className="mr-1">Fichier CSV à charger : </span>}
                        onFileLoaded={this.loadData.bind(this)}
                        onError={this.handleDataError}
                        parserOptions={{header: true, skipEmptyLines: true}}
                        inputId="limeSurvey"
                    />
                </Jumbotron>
                <Row>
                    <Col>
                        <Columns wishCount={this.state.wishCount}
                                 courses={this.state.courses}
                                 columns={this.state.columns}
                                 changeMode={this.changeColumnMode.bind(this)}
                                 changeWishNum={this.changeColumnWishNum.bind(this)}
                                 changeAppealNum={this.changeColumnAppealNum.bind(this)}/>
                    </Col>
                    <Col>
                        <Courses courses={this.state.courses} /*loadData = {this.loadData.bind(this)}*//>
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
