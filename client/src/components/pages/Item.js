import React, { Component } from 'react';
import AuthService from './AuthService';

class Item extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
    }

    componentDidMount(){
        // console.log(this.props.location.state.productResult)
    }

    render() {
        return (
            <div> Item </div>
        );
    }
}

export default Item;