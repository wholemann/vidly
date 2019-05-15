const Joi = require('@hapi/joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use(function(req,res, next) {
  console.log('Logging...');
  // next();
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Horror' },
  { id: 4, name: 'Romance' },
  { id: 5, name: 'Thriller' },
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.post('/api/genres', (req, res) => {

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre);
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with given ID was not found.');

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with given ID was not found.');
  
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with given ID was not found.');
  res.send(genre);
});

function validateGenre(genre) {
  const schema ={
    name: Joi.string().min(3).required()
  };
  
  return Joi.validate(genre, schema);
}