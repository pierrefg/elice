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

    changeColumnMode(e) {
        let value = e.target.value;
        let key = e.target.id;
        let wishCount = this.state.wishCount;
        let columns = {...this.state.columns};

        if (value === "discard") {
            // this.onDeleteWishNum(key);
            // Not even a wish column ! Nothing to be done
            if (this.state.columns[key].wishNum !== -1) {
                // Update the current wish columns count
                wishCount--;

                // Shift other wish columns' numbers
                for (let el in columns) {
                    if (columns[el].wishNum > columns[key].wishNum)
                        columns[el] = {...columns[el], wishNum: columns[el].wishNum - 1};
                }

                // Delete the column's wish number
                columns[key] = {...columns[key], wishNum: -1};
            }
        }

        columns[key] = {...columns[key], state: value};
        let courses = dataHandler.getCourses(this.state.students, columns);
        let rtColumns = reactTableUtil.columnParser(columns, courses);
        this.setState({
            columns: columns,
            wishCount: wishCount,
            courses: courses,
            rtColumns: rtColumns
        });
    }

    changeColumnWishNum(e) {
        let value = parseInt(e.target.value);
        let key = e.target.id;
        let wishCount = this.state.wishCount;
        let columns = {...this.state.columns};

        if (value === -1) {
            // this.onDeleteWishNum(key);
            // Not even a wish column ! Nothing to be done
            if (this.state.columns[key].wishNum !== -1) {
                // Update the current wish columns count
                wishCount--;

                // Shift other wish columns' numbers
                for (let el in columns) {
                    if (columns[el].wishNum > columns[key].wishNum)
                        columns[el] = {...columns[el], wishNum: columns[el].wishNum - 1};
                }

                // Delete the column's wish number
                columns[key] = {...columns[key], wishNum: -1};
            }
        } else {
            if (columns[key].wishNum === -1) {
                wishCount++;
                columns[key] = {...columns[key], wishNum: wishCount};
            }

            for (let el in columns) {
                if (columns[el].wishNum === value) {
                    columns[el] = {...columns[el], wishNum: columns[key].wishNum};
                    break;
                }
            }
        }

        columns[key] = {...columns[key], wishNum: value};

        let courses = dataHandler.getCourses(this.state.students, columns);
        let rtColumns = reactTableUtil.columnParser(columns, courses);
        this.setState({
            columns: columns,
            wishCount: wishCount,
            courses: courses,
            rtColumns: rtColumns
        });
    }
/*
    onDeleteWishNum(key) {
        // Not even a wish column ! Nothing to be done
        if (this.state.columns[key].wishNum === -1) {
            return;
        }

        let wishCount = this.state.wishCount;
        let columns = {...this.state.columns};

       // Update the current wish columns count
        wishCount--;

        // Shift other wish columns' numbers
        for (let el in columns) {
            if (columns[el].wishNum > columns[key].wishNum)
                columns[el] = {...columns[el], wishNum: columns[el].wishNum - 1};
        }

        // Delete the column's wish number
        columns[key] = {...columns[key], wishNum: -1};
    }
*/
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
                        <Columns wishCount={this.state.wishCount} changeMode={this.changeColumnMode.bind(this)}
                                 changeWishNum={this.changeColumnWishNum.bind(this)} columns={this.state.columns}/>
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
