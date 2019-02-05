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

  updateUser: (piece,username,data) => {
    return axios.post('/api/update', {piece: piece, username:username, data:data});
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
  
};