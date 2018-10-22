const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb://movie_admin:movie123321@ds241489.mlab.com:41489/movie-api', 
    { 
      useCreateIndex: true,
      useNewUrlParser: true
    }
  );
  mongoose.connection.on('open', () => {
    console.log('Connected to DB')
  });
  mongoose.connection.on('error', (err) => {
    console.log('DB Connection error', err)
  });

  mongoose.Promise = global.Promise;
}