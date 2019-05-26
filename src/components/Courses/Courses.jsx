import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

class Courses extends Component {
    render() {
        return (
            <div>
                <h2>Cours</h2>

                {Object.keys(this.props.courses).map((el) => {
                    return <CourseTile key={el} name={el} infos={this.props.courses[el]}/>;
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
                <span>Nombre total de places : {this.props.infos.nbStudents}   </span>
                <ButtonGroup>
                    <Button variant="outline-secondary" size="sm">-</Button>
                    <Button variant="outline-secondary" size="sm">+</Button>
                </ButtonGroup><br/>
                <span>Places réservées : {this.props.infos.nbReservedPlaces}   </span>
                <ButtonGroup>
                    <Button variant="outline-secondary" size="sm">-</Button>
                    <Button variant="outline-secondary" size="sm">+</Button>
                </ButtonGroup>
                <hr/>
            </div>
        );
    }
}

export default Courses;