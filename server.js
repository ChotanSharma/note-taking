const express = require('express');
const app = express();

// require fs to update the data in local
const fs = require('fs');
const path = require('path');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

const { notes } = require('./data/db');

const PORT = process.env.PORT || 3001;

function createNewData(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './data/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}


function validateData(note) {
    if (!note.title || typeof note.title !== 'string') {
      return false;
    }
    if (!note.text || typeof note.text !== 'string') {
      return false;
    }
    return true;
}

app.get('/api/notes', (req, res) => {
    let results = notes;
    if (results) {
        res.json(results);
      } else {
        res.send(404);
      }
});

app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if(!validateData(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const note = createNewData(req.body, notes);
        res.json(note);
    }
});


app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
  });