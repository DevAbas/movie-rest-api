const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Model
const User = require('../models/User');

// Returns index page endpoint
router.get('/', (req, res) => {
  res.json({ title: 'Index page' })
})

/* Register enpoint */
router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username,
      password: hash
    }).save()
    .then(data => { res.json(data) })
    .catch(err => { res.json(err) })
  });  
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if(err) 
      throw err
    if(!user) {
      res.json({
        status: false,
        message: 'Authenticated failed, user not found'
      })
    } else {
      bcrypt.compare(password, user.password)
        .then(result => {
          if(!result) {
            res.json({
              status: false,
              message: 'Authenticated failed, wrong password'
            })
          } else {
            const payload = {
              username
            }
            const token = jwt.sign(payload, req.app.get('api_secret_key'), {
              expiresIn: 720  // 12 saat
            });
            res.json({
              status: true,
              token
            })
          }
      })
    }
  })
});

module.exports = router;
