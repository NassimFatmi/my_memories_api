const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');


mongoose.connect('mongodb+srv://nassim:nassim@cluster0.y3vcb.mongodb.net/memories?retryWrites=true&w=majority').catch(err => {
  if (err) throw err;
});

mongoose.connection.on('error', err => {
  throw err.code;
});

mongoose.connection.once('open', () => console.log('Connected to database'));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cors());

app.use('/api/memories', require('./routes/api/memories'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));