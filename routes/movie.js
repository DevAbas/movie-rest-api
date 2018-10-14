const express = require('express');
const router = express.Router();

// Models loaded
const Movie = require('../models/Movie');

// Create a new movie router
router.post('/', function(req, res, next) {
  //const { title, imdb_score, category, country, year } = req.body;
  
  const movie = new Movie(req.body);

  movie.save()
    .then(data => { res.json(data) })
    .catch(err => { res.json(err) })

});

// Get all movies router
router.get('/', (req, res, next) => {
  Movie.find({})
    .then(data => { res.json(data) })
    .catch(err => { res.json(err) })
});

// Get top 10 movie list router
router.get('/top10', (req, res, next) => {
  Movie.find({}).limit(10).sort({ imdb_score: -1 })
    .then(data => { res.json(data) })
    .catch(err => { res.json(err) })
});

// Get movie only by id router
router.get('/:movie_id', (req, res, next) => {
  Movie.findById(req.params.movie_id)
    .then(movie => { 
      res.json(movie);
    })
    .catch(err => { next({ message: 'The movie was not found.', code: 99 });   });
});

// Update movie router
router.put('/:movie_id', (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movie_id, 
    req.body,
    {
      new: true
    }
  )
    .then(movie => { 
      res.json(movie);
    })
    .catch(err => { next({ message: 'The movie was not found.', code: 99 });   });
});

// Delete movie router
router.delete('/:movie_id', (req, res, next) => {
  Movie.findByIdAndRemove( req.params.movie_id )
    .then(movie => { 
      res.json({ message: 'Deleted movie' });
    })
    .catch(err => { next({ message: 'The movie was not found.', code: 99 });   });
});

// Between years router
router.get('/between/:start_year/:end_year', (req, res, next) => {
  const { start_year, end_year } = req.params;
  Movie.find({
    year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
  })
    .then(data => { res.json(data) })
    .catch(err => { res.json(err) })
});

module.exports = router;
