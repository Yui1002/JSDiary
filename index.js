'use strict';

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9e471gybZ3Z48!',
    database: 'yui_test'
});

app.get('/', function(req, res) {
    res.render('./index')
});

app.post("/saveCalendar", (req, res) => {
    console.log(req.body);
    if (req.body && req.body.message) {
        let message = req.body.message;
        let date = req.body.date;
        let todaysDate = new Date() + date;
        writeCalendarEventToDb(message, todaysDate, 
            (err) => {
                res.status(500).json({ error: err })
            },
            (success) => {
                res.status(200).json({success: success})
            }
        )
    }
})

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});


function writeCalendarEventToDb(message, date, errFunc, successFunc) {
    var sql = "INSERT INTO diary (content, date) VALUES(?, NOW())"
    con.query(sql, [message], (err, result) => {
        if (err) {
            console.log(err)
            errFunc(err);
            return;
        }
        successFunc(result);
    })
}