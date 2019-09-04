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
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleArray2(array1, array2) {
    if (array1.length !== array2.length) {
        throw Error("array1.length !== array2.length")
    }

    for (let i = array1.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array1[i], array1[j]] = [array1[j], array1[i]];
        [array2[i], array2[j]] = [array2[j], array2[i]];
    }
}

class App extends Component {
    constructor() {
        super();

        this.state = {
            wishCount: 0,
            columns: new Map(),
            courses: new Map(),
            students: [],
            rtColumns: [{dataField: 'id', text: 'Vide'}],
            statistics: {},
            isAffecting: false,
            errorShown: false,
            errorMessage: ""
        };
    }

    loadData(data, filename, meta) {
        data = dataHandler.preProcess(data);
        let columns = dataHandler.extractColumns(meta);
        let wishCount = 0;
        for (let name of columns.keys()) {
            if (columns.get(name).state === "wish") {
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
            rtColumns: rtColumns,
        });
    }

    handleDataError(e) {
        console.log(e);
    }

    deletedWishNum(state, key) {
        // Not even a wish column ! Nothing to be done
        if (state.columns.get(key).wishNum === -1) {
            return state;
        }

        state = {...state};
        state.column = new Map(state.column);

        // Update the current wish columns count
        state.wishCount--;

        // Shift other wish columns' numbers
        for (let el of state.columns.keys()) {
            if (state.columns.get(el).wishNum > state.columns.get(key).wishNum)
                state.columns.set(el, {...state.columns.get(el), wishNum: state.columns.get(el).wishNum - 1});
        }

        // Delete the column's wish number
        state.columns.set(key, {...state.columns.get(key), wishNum: -1});

        return state;
    }

    changeColumnMode(e) {
        let value = e.target.value;
        let key = e.target.id;
        let state = {...this.state};
        state.columns = new Map(state.columns);

        if (value !== "wish") {
            state = this.deletedWishNum(state, key);
        } else if (state.columns.get(key).wishNum === -1) {
            state.wishCount++;
            state.columns.set(key, {...state.columns.get(key), wishNum: state.wishCount});
        }

        if (value !== "appeal") {
            state.columns.set(key, {...state.columns.get(key), appealNum: -1});
        }

        state.columns.set(key, {...state.columns.get(key), state: value});
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
            if (state.columns.get(key).wishNum === -1) {
                state.wishCount++;
                state.columns.set(key, {...state.columns.get(key), wishNum: state.wishCount});
            }

            for (let el of state.columns.keys()) {
                if (state.columns.get(el).wishNum === value) {
                    state.columns.set(el, {...state.columns.get(el), wishNum: state.columns.get(key).wishNum});
                    break;
                }
            }
        }

        state.columns.set(key, {...state.columns.get(key), wishNum: value});
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
            for (let el of state.columns.keys()) {
                if (state.columns.get(el).appealNum === value) {
                    state.columns.set(el, {...state.columns.get(el), appealNum: state.columns.get(key).appealNum});
                    break;
                }
            }
        }

        state.columns.set(key, {...state.columns.get(key), appealNum: value});
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

        let students = this.state.students;

        let wishMatrix = [];
        for (let studentId in students) {
            let wishList = [];
            wishList.studentId = studentId;
            for (let col in students[studentId]) {
                if (this.state.columns.get(col) !== undefined && this.state.columns.get(col).wishNum !== -1) {
                    let limeSurveyCourseName = students[studentId][col];
                    let limeSurveyCourseRank = this.state.columns.get(col).wishNum;
                    let limeSurveyCourseId = courseIds[limeSurveyCourseName];
                    wishList[limeSurveyCourseId] = limeSurveyCourseRank;
                }
            }

            wishMatrix[studentId] = wishList;
        }

        return wishMatrix;
    }

    getStudentsInterestMatrix() {
        let courseIds = {};

        let id = 0;
        for (let name of this.state.courses.keys()) {
            courseIds[name] = id++;
        }

        let students = this.state.students;

        let interestMatrix = [];
        for (let studentId in students) {
            let interestList = [];
            interestList.studentId = studentId;
            for (let col in students[studentId]) {
                if (this.state.columns.get(col)!== undefined && this.state.columns.get(col).appealNum !== -1) {
                    let limeSurveyInterest = students[studentId][col].toLowerCase();
                    let course = this.state.columns.get(col).appealNum;
                    let courseId = courseIds[course];
                    let interest = 0;

                    if (limeSurveyInterest.includes("pas du tout")) {
                        interest = -2;
                    } else if (limeSurveyInterest.includes("peu")) {
                        interest = -1;
                    } else if (limeSurveyInterest.includes("très")) {
                        interest = 2;
                    } else {
                        interest = 1;
                    }

                    interestList[courseId] = interest;
                }
            }

            interestMatrix[studentId] = interestList;
        }

        return interestMatrix;
    }

    countManualAffectation(courseName) {
        let count = 0;
        for (let studentId in this.state.students) {
            if (this.state.students[studentId].affectationMode === courseName)
                count++;
        }

        return count;
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

    affect(useAppeal) {
        let students = [...this.state.students];

        // On efface les affectations précédentes
        for (let studentId in students) {
            students[studentId] = {...students[studentId], result: "Calcul en cours"};
        }

        this.setState({students: students, isAffecting: true});
        setTimeout(() => this._affect(useAppeal), 0);
    }

    _affect(useAppeal) {
        // wishMatrix et interestMatrix ont pour clé le studentId
        // tandis que wishMatrixAuto et interestMatrixAuto ont pour clés des ids randomisés

        let wishMatrix = this.getStudentsWishMatrix();
        let minPlaces = this.getCourseMinPlaces();
        let maxPlaces = this.getCourseMaxPlaces();
        let penalties = this.computePenalties(this.state.courses.size);
        let interestMatrix = undefined;

        // On enlève les étudiants qui sont affectés manuellement et on mélange la matrice
        let wishMatrixAuto = wishMatrix.filter(listMatrix => this.state.students[listMatrix.studentId].affectationMode === "Automatique");
        let interestMatrixAuto = undefined;
        if (useAppeal) {
            interestMatrix = this.getStudentsInterestMatrix();
            interestMatrixAuto = interestMatrix.filter(listMatrix => this.state.students[listMatrix.studentId].affectationMode === "Automatique");
            shuffleArray2(wishMatrixAuto, interestMatrixAuto);
        } else {
            shuffleArray(wishMatrixAuto);
        }

        let courseNames = Array.from(this.state.courses.keys());

        // On décompte les étudiants qui sont affectés manuellement
        let minPlacesAuto = courseNames.map((courseName, index) => minPlaces[index] - this.countManualAffectation(courseName));
        let maxPlacesAuto = courseNames.map((courseName, index) => maxPlaces[index] - this.countManualAffectation(courseName));

        let assignmentsAuto = undefined;

        try {
            // On lance l'algorithme sur tous ceux qui doivent être affectés automatiquement
            assignmentsAuto = MunkresApp.process(penalties, minPlacesAuto, maxPlacesAuto, wishMatrixAuto, interestMatrixAuto);
        } catch (e) {
            // S'il y a une erreur
            this.showError(e.message);
            this.setState({isAffecting: false});
            return;
        }

        let assignments = [];
        let students = [...this.state.students];

        // On écrit le résultat des affectations automatiques en retrouvant le studentId original
        for (let id in assignmentsAuto) {
            let studentId = wishMatrixAuto[id].studentId;
            assignments[studentId] = assignmentsAuto[id];
            students[studentId] = {...students[studentId], result: courseNames[assignmentsAuto[id]-1]};
        }

        // On fait les affectations manuelles
        for (let studentId in students) {
            if (students[studentId].affectationMode !== "Automatique")
            {
                assignments[studentId] = courseNames.indexOf(students[studentId].affectationMode)+1;
                students[studentId] = {...students[studentId], result: students[studentId].affectationMode};
            }
        }

        let statistics = MunkresApp.analyze_results(assignments, penalties, minPlaces, maxPlaces, wishMatrix, interestMatrix);

        this.setState({
            students: students,
            statistics: statistics,
            isAffecting: false
        });
    }

    loadState(e) {
        let reader = new FileReader();
        reader.onload = e => {
            let state = JSON.parse(e.target.result);
            state.columns = new Map(state.columns);
            state.courses = new Map(state.courses);
            this.setState(state);
        };
        reader.readAsText(e.target.files[0]);
    }

    saveState() {
        let fileDownload = require('js-file-download');
        let state = {...this.state}
        state["columns"] = [...state["columns"]]
        state["courses"] = [...state["courses"]]
        let data = JSON.stringify(state);
        fileDownload(data, 'state.json');
    }

    showError(message) {
        this.setState({errorShown: true, errorMessage: message});
    }

    hideError() {
        this.setState({errorShown: false});
    }

    render() {
        return (
            <>

                <Container fluid={true}>
                    <Jumbotron>
                        <input type="file" id="file" ref="loadStateInput" style={{display: "none"}} onChange={e => this.loadState(e)} />
                        <Button className="btn-primary float-right"
                                onClick={() => this.saveState()}
                                disabled={this.state.isAffecting}>
                            Enregistrer
                        </Button>
                        <Button className="btn-primary float-right mr-2"
                                onClick={() => this.refs.loadStateInput.click()}
                                disabled={this.state.isAffecting}>
                            Charger
                        </Button>

                        <h1>Ventilation</h1>
                        <hr/>
                        <CSVReader
                            cssClass="csv-reader-input"
                            label={<span className="mr-1">Fichier CSV à charger : </span>}
                            onFileLoaded={this.loadData.bind(this)}
                            onError={this.handleDataError}
                            parserOptions={{header: true,
                                            skipEmptyLines: true,
                                            transformHeader: dataHandler.sanitizeColumnName}}
                            inputId="limeSurvey"
                            disabled={this.state.isAffecting}
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
                                     changePlaces={this.changePlaces.bind(this)}/>
                        </Col>
                    </Row>
                    <hr/>
                    <Affectations students={this.state.students}
                                  rtColumns={this.state.rtColumns}
                                  isAffecting={this.state.isAffecting}
                                  affect={this.affect.bind(this)}/>
                    <hr/>
                    <Statistics statistics={this.state.statistics}
                                courses={this.state.courses}/>

                </Container>

                <Modal show={this.state.errorShown} onHide={this.hideError.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Une erreur est survenue...</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>{this.state.errorMessage}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={this.hideError.bind(this)}>Fermer</Button>
                    </Modal.Footer>
                </Modal>

            </>
        );
    }
}

export default App;
