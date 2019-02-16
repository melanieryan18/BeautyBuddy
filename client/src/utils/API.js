import axios from 'axios';
export default {
  // Gets a single user by id
  getUser: (id) => {
    return axios.get(`/api/user/${id}`);
  },

  postZip: (zipcode) => {
    return axios.post(`/api/google/${zipcode}`)
  },
  // sign up a user to our service
  signUpUser: (username, email, password) => {
    return axios.post('api/signup', { username: username, email: email, password: password });
  },

  saveItem: (username, image_link,product_link,name, brand, price) => {
    return axios.post('/api/saveItem', {username: username,image_link: image_link ,product_link: product_link, name: name, brand:brand, price:price });
  },

  updateUser: (piece,username,data) => {
    return axios.post('/api/update', {piece: piece, username:username, data:data});
  },

  facialRecognition: (username) => {
    return axios.post('/api/face',{username: username});
  },

  itemCall: function (category) {
    // return new Promise((resolve, reject) => {
      const itemMap = new Map();
      itemMap.set('Eye', 'mascara');
      itemMap.set('Skin', 'foundation');
      itemMap.set('Nail', 'nail_polish');
      itemMap.set('Lip', 'lipstick');
  
      return axios.post('/api/getItem', { category: itemMap.get(category)});
  },

  fillShop: function(brands) {
    return axios.post('/api/getShop', { brand : brands});
  },
  
  // From here call your facial rout from the server with given image
};