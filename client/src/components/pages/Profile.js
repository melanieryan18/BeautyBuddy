import React, { Component } from 'react';
import withAuth from './withAuth';
import API from '../../utils/API';
import "../pages/style.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      image: "",
      zipcode: "_",
      favBrand: "_",
      beautyPlaces: [],
      shop: []
    }
    this.uploadPic = this.uploadPic.bind(this);

  }

  componentDidMount() {
    API.getUser(this.props.user.id).then(res => {
      this.setState({
        username: res.data.username,
        email: res.data.email,
        image: res.data.image,
        zipcode: res.data.zipcode,
        favBrand: res.data.favBrand
      });
      this.getBeautyPlaces();
      if (this.state.zipcode !== "_") {
        this.getShopItems();
      }
    });

  }

  getBeautyPlaces = () => {
    API.postZip(this.state.zipcode).then(res => {
      const beautyStores = res.data;
      this.setState({
        beautyPlaces: beautyStores
      })
    });
  }

  getShopItems = () => {
    API.fillShop("benefit").then(res => {
      console.log(res.data)
      const shop = res.data
      this.setState({ shop: shop })
    })
  };

  uploadPic(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('category', 'image');

    fetch('https://www.fileconvrtr.com/api/convert/file?apiKey=a8f545dbb31244a5b081a8cc6bdf37f7', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ image: body.s3Url });
        console.log(this.state)
        API.updateUser('image', this.state.username, body.s3Url)
      })
    });
  }

  updateZip = () => {
    const newZip = prompt("please provide a five digit zipcode");
    this.setState({ zipcode: newZip });
    API.updateUser('zipcode', this.state.username, newZip)

  }

  render() {
    return (
      <div className="container">

        <div className="row">
          <div className="col-sm-3 card mx-auto mb-3">
            <h6>Welcome {this.state.username}</h6>
            <div className="profile-image" style={{ backgroundImage: `url(${this.state.image})` }}>
            </div>
            <form onSubmit={this.uploadPic} >
              <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
              <button type="submit">Save Image</button>
            </form>
            <div>Zip Code: {this.state.zipcode} </div>
            <button onClick={this.updateZip} >Alter Zipcode</button>
            <h6>Favorate brands: {this.state.favBrand}</h6>
          </div>
          <div className="col-md-4 bg-light">
            <div className="card-deck">
              <div className="card">
                <img className="card-img-top" src="https://via.placeholder.com/100x100" alt="Card image cap" />
                <div className="card-body">
                  <h5 className="card-title">Your Shop</h5>
                  {this.state.shop.map(item => (
                    <div>
                      <div className="blahblah" style={{ backgroundImage: `url(${item.image_link})` }}>
                      </div>
                      <p>Item: {item.name}</p>
                      <p>Brand: {item.brand}</p>
                      <p>Price: {item.price}</p>

                      <hr />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 bg-light">
            <div className="card">
              <img className="card-img-top" src="/image/beautyplace.jpg" alt="Card image cap" />
              <div className="card-body">
                <h5 className="card-title">Beauty Places</h5>

                {this.state.beautyPlaces.map(yourPlaces => (
                  <div key={yourPlaces.name}>
                    <hr />
                    <h6 className="nav-pages">{yourPlaces.name}</h6>
                    <p>{yourPlaces.address}</p>
                    <p>{yourPlaces.rating} Stars</p>

                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div >

    )
  }
}

export default withAuth(Profile);