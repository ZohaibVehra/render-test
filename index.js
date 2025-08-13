const express = require('express')
require('dotenv').config()
const Note = require('./models/note')


const app = express()
//app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
let notes = [
    {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateID = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}


app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(n => n.id === id)

    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
    
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(n => n.id !== id)
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content){
        return response.status(400).json({error: 'content missing'})
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateID()
    }

    notes = notes.concat(note)
    response.json(note)

})

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const { content, important } = req.body;

  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'note not found' });
  }

  const updatedNote = {
    ...notes[noteIndex],
    content: content !== undefined ? content : notes[noteIndex].content,
    important: important !== undefined ? important : notes[noteIndex].important
  };

  notes[noteIndex] = updatedNote;
  res.json(updatedNote);
});

const PORT = process.env.PORT
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});