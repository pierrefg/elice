import React, {Component} from 'react';
import './App.css';

import Columns from '../../components/Columns/Columns'
import Courses from '../../components/Courses/Courses'
import Affectations from '../../components/Affectations/Affectations'
import Statistics from '../../components/Statistics/Statistics'
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
            courses: new Map(),
            students: [],
            rtColumns: [{dataField: 'idVent', text: 'Vide'}],
            statistics: {}
        };
    }

    loadData(data) {
        data = dataHandler.createIds(dataHandler.preProcess(data));
        let columns = dataHandler.extractColumns(data);
        let wishCount = 0;
        for (let name in columns) {
            if (columns[name].state === "wish") {
                wishCount++;
            }
        }

        let courses = dataHandler.updatedCourses(new Map(), data, columns);
        let rtColumns = reactTableUtil.columnParser(columns, courses);

        this.setState({
            wishCount: wishCount,
            columns: columns,
            courses: courses,
            students: data,
            rtColumns: rtColumns
        });
    }

    handleDataError(e) {
        console.log(e);
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
        state.courses = dataHandler.updatedCourses(state.courses, state.students, state.columns);
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
        state.courses = dataHandler.updatedCourses(state.courses, state.students, state.columns);
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
        state.courses = dataHandler.updatedCourses(state.courses, state.students, state.columns);
        state.rtColumns = reactTableUtil.columnParser(state.columns, state.courses);
        this.setState(state);
    }

    changePlaces(e) {
        let name = e.target.form.id;
        let type = e.target.name;
        let value = e.target.value;

        let courses = new Map(this.state.courses);
        switch (type) {
            case "min":
                courses.set(name, {...courses.get(name), minPlaces: value});
                break;
            case "max":
                courses.set(name, {...courses.get(name), maxPlaces: value});
                break;
            case "reserved":
                courses.set(name, {...courses.get(name), reservedPlaces: value});
                break;
            default:
                throw Error("unexpected case");
        }

        this.setState({courses: courses});
    }

    getStudentsWishMatrix() {
        let courseIds = {};

        let id = 0;
        for (let name of this.state.courses.keys()) {
            courseIds[name] = id++;
        }

        let wishlist = [];
        for (let studentId in this.state.students) {
            wishlist[studentId] = [];
            for (let col in this.state.students[studentId]) {
                if (this.state.columns[col] !== undefined && this.state.columns[col].wishNum !== -1) {
                    let limeSurveyCourseName = this.state.students[studentId][col];
                    let limeSurveyCourseRank = this.state.columns[col].wishNum;
                    let limeSurveyCourseId = courseIds[limeSurveyCourseName];
                    wishlist[studentId][limeSurveyCourseId] = limeSurveyCourseRank;
                }
            }
        }

        return wishlist;
    }

    getCourseMinPlaces() {
        let places = [];
        let courseId = 0;
        for (let [, course] of this.state.courses) {
            places[courseId++] = course.minPlaces - course.reservedPlaces;
        }

        return places;
    }

    getCourseMaxPlaces() {
        let places = [];
        let courseId = 0;
        for (let [, course] of this.state.courses) {
            places[courseId++] = course.maxPlaces - course.reservedPlaces;
        }

        return places;
    }

    computePenalties(size) {
        let penalties = [];
        for (let i = 0; i < size; i++)
            penalties[i] = 10*i*i;
        return penalties;
    }

    affect() {
        let wishMatrix = this.getStudentsWishMatrix();
        let minPlaces = this.getCourseMinPlaces();
        let maxPlaces = this.getCourseMaxPlaces();
        let penalties = this.computePenalties(this.state.courses.size);

        let assignments = MunkresApp.process(penalties, minPlaces, maxPlaces, wishMatrix, undefined);
        let statistics = MunkresApp.analyze_results(assignments, penalties, minPlaces, maxPlaces, wishMatrix, undefined);

        console.log(this.state.courses);

        let students = [...this.state.students];

        let courseNames = Array.from(this.state.courses.keys());

        for (let studentId in assignments) {
            students[studentId] = {...students[studentId], result: courseNames[assignments[studentId]-1]};
        }

        this.setState({
          students: students,
          statistics: {...statistics}
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
            <Container fluid={true}>
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
                    <Col sm="8">
                        <Columns wishCount={this.state.wishCount}
                                 courses={this.state.courses}
                                 columns={this.state.columns}
                                 changeMode={this.changeColumnMode.bind(this)}
                                 changeWishNum={this.changeColumnWishNum.bind(this)}
                                 changeAppealNum={this.changeColumnAppealNum.bind(this)}/>
                    </Col>
                    <Col sm="4">
                        <Courses courses={this.state.courses}
                                 changePlaces={this.changePlaces.bind(this)}
                               /*loadData = {this.loadData.bind(this)}*//>
                    </Col>
                </Row>
                <hr/>
                <Affectations students={this.state.students}
                              rtColumns={this.state.rtColumns}
                              affect={this.affect.bind(this)}/>
                <hr/>
                <Statistics statistics={this.state.statistics}
                            courses={this.state.courses}/>
            </Container>
        );
    }
}

export default App;
