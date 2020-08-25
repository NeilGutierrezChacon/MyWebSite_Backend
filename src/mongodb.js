 /**
  * @file mongodb.js
  * 
  * @description Connect to the mongodb cloud database
  */

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(db => console.log('Database mongo is conected'));