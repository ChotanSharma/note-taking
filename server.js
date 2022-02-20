const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const { notes } = require('./data/db');

// middleware to instruct server certain files available
app.use(express.static('public'));

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

const PORT = process.env.PORT || 3001;

// create new note and save
function createNewData(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './data/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    return note;
}

// validate the note input
function validateData(note) {
    if (!note.title || typeof note.title !== 'string') {
      return false;
    }
    if (!note.text || typeof note.text !== 'string') {
      return false;
    }
    return true;
}


// delete notes
function deleteNote(id, notesArray) {
    const noteIndex = id - 1;
    notesArray.splice(noteIndex, 1);
    notesArray.map((note, index) => {
        note.id = index.toString();;
    })
    fs.writeFileSync(
        path.join(__dirname, "./data/db.json"),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return notesArray;
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

//request to delete note by id
app.delete('/api/notes/:id', (req, res) => {
    const result = deleteNote(req.params.id, notes);
    res.json(result);
});

// route to create homepage for server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// wildcard route to check bad request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});