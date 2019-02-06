import React, { Component } from 'react';
import API from '../../utils/API';

class Item extends Component {
    constructor() {
        super();
        // this.Auth = new AuthService();

        this.state = {
            items: [],
        };
    }

    componentDidMount() {
        // console.log(this.props)
        API
            .itemCall(this.props.location.state.productName || "Eye")
            .then(res => {
                this.setState({ items: res.data })
                console.log(this.state.items);
            });
    }

    render() {
        return (
            <div className="container">

                <div className="row">
                    <div className="col-md-4 bg-light">
                        <div className="card-deck">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Your Shop</h5>
                                    {this.state.items.map(yourItems => (
                                        <div key={yourItems.name}>
                                            <hr />
                                            <a href={yourItems.product_link} target="blank">
                                                <div className="yourMakeup" style={{ backgroundImage: `url(${yourItems.image_link})` }}>
                                                </div>
                                            </a>
                                            <h6 className="nav-pages">{yourItems.name}</h6>
                                            <p>{yourItems.brand}</p>
                                            <p>${yourItems.price}</p>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Item;
