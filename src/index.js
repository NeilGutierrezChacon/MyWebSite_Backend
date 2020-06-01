const express = require('express');
const app = express();

const path = require('path');




app.set('port',process.env.PORT || 3000);


const dirPublic = path.join(__dirname,'public');

app.use('/',express.static(dirPublic));



app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
    console.log("Path of directori public: ",dirPublic);
});