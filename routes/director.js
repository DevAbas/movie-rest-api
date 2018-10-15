const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Models
const Director = require('../models/Director');

// Create a director endpoint
router.post('/', (req, res, next) => {
  const director = new Director(req.body);

  director.save()
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

// Get all directors endpoint
router.get('/', (req, res, next) => {
  Director.aggregate([
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies' 
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        bio: '$_id.bio',
        movies: '$movies' 
      }
    }
  ])
  .then(data => { res.json(data) })
  .catch(err => { res.json(err) })
});

// Get the director by id endpoint
router.get('/:director_id', (req, res, next) => {
  Director.aggregate([
    {
      $match: {
        '_id': mongoose.Types.ObjectId(req.params.director_id)
      }   
    },  
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies' 
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        bio: '$_id.bio',
        movies: '$movies' 
      }
    }
  ])
  .then(data => { res.json(data) })
  .catch(err => { res.json(err) })
});

// Update director endpoint
router.put('/:director_id', (req, res, next) => {
  Director.findByIdAndUpdate(
    req.params.director_id, 
    req.body,
    {
      new: true
    }
  )
    .then(director => { 
      res.json(director);
    })
    .catch(err => { 
      next({ message: 'The director was not found.', code: 99 }) 
    });
});

// Delete director endpoint
router.delete('/:director_id', (req, res, next) => {
  Director.findByIdAndRemove( req.params.director_id )
    .then(director => { 
      res.json({ message: 'Deleted director' });
    })
    .catch(err => { next({ message: 'The director was not found.', code: 99 });   });
});

module.exports = router;