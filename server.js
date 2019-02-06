require('dotenv').config()
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const mongoose = require('mongoose');
const morgan = require('morgan'); // used to see requests
const app = express();
const server = require('http').createServer(app);
const db = require('./models');
const axios = require('axios');
const PORT = process.env.PORT || 3001;


const io = require('socket.io')(server);

// Setting CORS so that any website can
// Access our API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

//log all requests to the console
app.use(morgan('dev'));

// Setting up express to use json and set it to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appDB', { useNewUrlParser: true });
// Set index on our data(not recommended for big DB)
mongoose.set('useCreateIndex', true);

// Init the express-jwt middleware
const isAuthenticated = exjwt({
  secret: process.env.SERVER_SECRET
});

// API Call for product data

let productType = "foundation";
const queryUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${productType}`;

axios.get(queryUrl)
  .then(response => {
    for (let i = 0; i < 4; i++) {
      let brand = response.data[i].brand;

    }
  })
  .catch(error => {
    console.log(error);
  })



// LOGIN ROUTE
app.post('/api/login', (req, res) => {
  db.User.findOne({
    email: req.body.email
  }).then(user => {
    user.verifyPassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        let token = jwt.sign({ id: user._id, email: user.email }, process.env.SERVER_SECRET, { expiresIn: 129600 }); // Sigining the token
        res.json({ success: true, message: "Token Issued!", token: token, user: user });
      } else {
        res.status(401).json({ success: false, message: "Authentication failed. Wrong password." });
      }
    });
  }).catch(err => res.status(404).json({ success: false, message: "User not found", error: err }));
});

// SIGNUP ROUTE
app.post('/api/signup', (req, res) => {
  db.User.create(req.body)
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
});


// MakeUp API Routes
productResult: [],

  app.post('/api/getItem', async (req, res) => {
    const productResult = [];
    const queryUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${req.body.category}`;
    // const promise = new Promise(res, rej)

    try {
      response = await axios.get(queryUrl)
      console.log(response.data)
      for (let i = 0; i < 6; i++) {
        productResult.push(response.data[i])
      }
      res.send(productResult);
    } catch (error) {
      console.log(error);
    }
  })

app.post('/api/getShop', (req, res) => {
  const shop = [];
  const queryUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${req.body.brand}`
  axios.get(queryUrl)
    .then(response => {
      for (let i = 0; i < 6; i++) {
        shop.push(response.data[i])
      }
      console.log(shop)
      res.send(shop);
    })
    .catch(error => {
      console.log(error);
    })
})

// Update Route
app.post('/api/update', async (req, res) => {
  switch (req.body.piece) {
    case 'image':
    
      try {
        const data = await db.User.findOneAndUpdate({ username: req.body.username }, { image: req.body.data })
        res.json(data)
        console.log("store")
      } catch (error) {
        res.status(400).json(err)
      }
      break;
    case 'zipcode':
    console.log("store")
      try {
        const data = await db.User.findOneAndUpdate({ username: req.body.username }, { zipcode: req.body.data })
        res.json(data)
      } catch (error) {
        res.status(400).json(err)
      }
      break;
  }
})

// Any route with isAuthenticated is protected and you need a valid token
// to access
app.get('/api/user/:id', isAuthenticated, (req, res) => {
  db.User.findById(req.params.id).then(data => {
    if (data) {
      res.json(data);
    } else {
      res.status(404).send({ success: false, message: 'No user found' });
    }
  }).catch(err => res.status(400).send(err));
});

app.post('/api/google/:zipcode', (req, res) => {

  let zip = req.params.zipcode;
  const placesApiKey = process.env.API_KEY;
  let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip}&key=${placesApiKey}`;
  const storeList = [];

  axios.get(geocodeUrl).then(async response => {
    let result = response.data.results[0];
    let lattitude = result.geometry.location.lat;
    let longitude = result.geometry.location.lng;
    console.log(`Lat: ${lattitude} | Long: ${longitude}`);

    function getStores(lal, long, key) {
      return new Promise((resolve, reject) => {
        let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lal},${long}&radius=15000&type=beauty_salon&key=${key}`;
        axios.get(placesUrl).then(response => {
          let storesNearby = (response.data.results);

          // for loop through JSON response retrieve place info
          for (let i = 0; i < 6; i++) {
            let store = {
              name: storesNearby[i].name,
              address: storesNearby[i].vicinity,
              rating: storesNearby[i].rating
            }
            storeList.push(store);
          };
          resolve(storeList)
        }).catch(error => reject(error));
      })
    }

    let storeData = await getStores(lattitude, longitude, placesApiKey);
    res.send(storeData);

  });
})

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


app.get('/', isAuthenticated /* Using the express jwt MW here */, (req, res) => {
  res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
    res.status(401).send(err);
  }
  else {
    next(err);
  }
});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// SOCKET.IO CHAT INITIATION 
io.on('connection', (socket) => {
  console.log('New user connected')
   // we are listening to an event here called 'message'
   socket.on('message', (message) => {
    // and emitting the message event for any client listening to it
    io.emit('message', message);
  });
})

server.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
