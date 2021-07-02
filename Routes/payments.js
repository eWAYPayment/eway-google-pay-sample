/* jshint esversion: 8 */

require('dotenv').config();
const express = require('express');
let app = express.Router();
var rapid = require('eway-rapid');
const axios = require('axios');
var btoa = require('btoa');

//Load env variables
var key = process.env.APIKEY;
var password = process.env.PASS;
var endpoint = process.env.TESTURL; //Sandbox or Production when using the SDK


const client = rapid.createClient(key, password, endpoint);

//for Rapid plus 
const auth = authenticateUser(key, password);
axios.defaults.headers.common.Authorization = auth; // Add auth for all requests

app.post('/rsp', async (req, res) => {
    let data = req.body;
    const resp = await getSharedPageUrl(data);

    res.send(resp);
});

app.post('/direct', async (req, res) => {
    let body = req.body;

    var resp = await axios.post(endpoint + 'Transactions', body).then(res => {
        if (res.data != null) {
            return res.data;
        }
    }).catch(error => {
        return error;
    });
    res.send(resp);
});

app.post('/getAccessCode', async (req, res) => {
    let data = req.body;
    const resp = await createAccessCode(data);
    res.send(resp);
});

app.post('/result', async (req, res) => {
    let data = req.body.accessCode;
    const resp = await queryTransaction(data);

    res.send(resp);
});

async function getSharedPageUrl(data) {
    var client = rapid.createClient(key, password, endpoint);

    var res = await client.createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED,
            data
        )
        .then(function (response) {
            if (response.getErrors().length == 0) {
                redirectURL = response.get('SharedPaymentUrl');
                return redirectURL;
            } else {
                response.getErrors().forEach(function (error) {
                    console.log("Response Messages: " + rapid.getMessage(error, "en"));
                });
            }
        })
        .catch(function (reason) {
            reason.getErrors().forEach(function (error) {
                console.log("Response Messages: " + rapid.getMessage(error, "en"));
            });
        });
    return res;
}

async function queryTransaction(accessCode) {
    var res = await client.queryTransaction(accessCode)
        .then(function (response) {
            if (response != undefined) {
                return response;
            } else {
                var errorCodes = response.get('Transactions[0].ResponseMessage').split(', ');
                errorCodes.forEach(function (errorCode) {
                    console.log("Response Message: " + rapid.getMessage(errorCode, "en"));
                });
                return errorCodes;
            }
        })
        .catch(function (reason) {
            reason.getErrors().forEach(function (error) {
                console.log("Response Messages: " + rapid.getMessage(error, "en"));
                return reason;
            });
        });
    return res;
}

async function createAccessCode(data) {
    var resp = await client.createTransaction(rapid.Enum.Method.TRANSPARENT_REDIRECT,
        data
    ).then(function (response) {
        return response;
    });
    return resp;
}

function authenticateUser(user, password) {
    var token = user + ":" + password;
    var hash = btoa(token);
    return "Basic " + hash;
}

module.exports = app;