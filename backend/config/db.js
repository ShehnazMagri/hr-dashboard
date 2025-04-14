const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/authDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));
module.exports = mongoose;