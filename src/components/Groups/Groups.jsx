import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

class Groups extends Component {
    render() {
        return (
            <div>
                <h2> Groupes </h2>

                {Object.keys(this.props.groups).map((el) => {
                    return <GroupTile key={el} name={el} infos={this.props.groups[el]}/>;
                })}
            </div>
        );
    }
}

class GroupTile extends Component {
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

export default Groups;