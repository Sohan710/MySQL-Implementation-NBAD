const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const port = process.env.port || 4000;
const app = express();

app.use(bodyParser.json());

const connections = mysql.createConnection({
    host: 'sql9.freemysqlhosting.net',
    user: 'sql9654409',
    password: 'jWHLv1yvKl',
    database: 'sql9654409'
});

connections.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database.");
});

function encryptPassword(password) {
        return password;
}
function TransformDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

app.post('/api/sign', async (req, res) => {
    try {
        const { username, password } = req.body;
        const pwd = encryptPassword(password);
        const date = TransformDate(new Date());

        connections.query('INSERT INTO user VALUES (?, ?, ?, ?)', [null, username, pwd, date], function(error, results, fields) {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ message: "Error inserting data into the database." });
            }
            res.json(results);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', async (req, res) => {
    connections.query('SELECT * FROM budget', function(error, results, fields) {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Error fetching data from the database." });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
