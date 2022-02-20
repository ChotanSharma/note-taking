const express = require('express');
const app = express();
const { notes } = require('./data/db');

const PORT = process.env.PORT || 3001;



app.get('/api/notes', (req, res) => {
    let results = notes;
    console.log(req.query);
    res.json(results);
});


app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
  });