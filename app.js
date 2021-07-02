//create the server
const express = require("express");
const app = express();
const path = require('path');
var cors = require('cors');
var bodyParser = require("body-parser");


const port = process.env.PORT | 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const payments = require('./Routes/payments');
app.use(cors());
app.use('/payments', payments);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
    console.log(`Server listening at http://*:${port}`);
});