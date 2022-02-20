const express = require('express');
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

const { notes } = require('./data/db');

const PORT = process.env.PORT || 3001;



app.get('/api/notes', (req, res) => {
    let results = notes;
    if (results) {
        res.json(results);
      } else {
        res.send(404);
      }
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});


app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
  });