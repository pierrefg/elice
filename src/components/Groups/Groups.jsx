import React, { Component } from 'react';

class Groups extends Component {
    render() {
        return (
        <div>
            <h2> Groupes </h2>

            {Object.keys(this.props.groups).map(function(el){
                return <GroupTile key={el} name={el}/>;
            })}
        </div>
        );
    }
}

class GroupTile extends Component {
    render() {
        return (
            <div>
              {this.props.name}
            </div>
        );
    }
}

export default Groups;