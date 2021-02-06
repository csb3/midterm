// These are some dummy values to pass to templates for testing. please don't edit - IK


const breads = [

  bread1 = {
    id: 1,
    name: 'Thick Pumpernickel',
    description: 'A hearty bread, lightly dropped on the ground once',
    price: 600,
    photo_url: 'https://i.imgur.com/02vNDUL.jpeg',
    creation_date: '2020-02-06',
    user_id: 2,
    featured: false,
    weight: '2kg',
    city: 'Vancouver',
    sold: false,
    deleted: false
  },

  bread2 = {
    id: 2,
    name: 'Soggy Dempsters',
    description: 'Unfortunately dropped this in a puddle outside my house, and now my cat won\'t eat it',
    price: 1,
    photo_url: 'https://i.imgur.com/RTSFzpL.jpg',
    creation_date: '2020-02-06',
    user_id: 4,
    featured: false,
    weight: '100g',
    city: 'Vancouver',
    sold: false,
    deleted: false
  },

  bread3 = {
    id: 3,
    name: 'Regular Bread',
    description: 'Full of wheat',
    price: 500,
    photo_url: 'https://i.imgur.com/fPwHJxe.png',
    creation_date: '2020-02-06',
    user_id: 3,
    featured: false,
    weight: '400g',
    city: 'Vancouver',
    sold: false,
    deleted: false
  }

];


const user = {
  userID: 1,
}




const templateVars = {
  user: user,
  listings: breads,


};



module.exports = { templateVars };








