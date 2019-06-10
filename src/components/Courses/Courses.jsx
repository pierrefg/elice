import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Courses extends Component {
    render() {
        return (
            <div>
                <h2>Cours</h2>

                {Array.from(this.props.courses.keys(), (name, i) => {
                    return <CourseTile key={name}
                                       name={name}
                                       infos={this.props.courses.get(name)}
                                       last={i+1 === this.props.courses.size}
                                       changePlaces={this.props.changePlaces}/>;
                })}
            </div>
        );
    }
}

class CourseTile extends Component {
    render() {
        return (
            <div>
                <b>{this.props.name}</b><br/>
                <Form id={this.props.name}>
                    <Form.Group as={Row} className="mb-0" controlId="">
                        <Form.Label column sm="8" className="py-0 mt-auto">Nombre minimum d'étudiants&nbsp;:</Form.Label>
                        <Col sm="4">
                            <Form.Control size="sm" type="number" name="min" onChange={this.props.changePlaces} value={this.props.infos.minPlaces} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-0">
                        <Form.Label column sm="8" className="py-0 mt-auto">Nombre maximum d'étudiants&nbsp;:</Form.Label>
                        <Col sm="4">
                            <Form.Control size="sm" type="number" name="max" onChange={this.props.changePlaces} value={this.props.infos.maxPlaces} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-0">
                        <Form.Label column sm="8" className="py-0 mt-auto">Nombre de places réservées&nbsp;:</Form.Label>
                        <Col sm="4">
                            <Form.Control size="sm" type="number" name="reserved" onChange={this.props.changePlaces} value={this.props.infos.reservedPlaces} />
                        </Col>
                    </Form.Group>
                </Form>
                {!this.props.last && <hr/>}
            </div>
        );
    }
}

export default Courses;