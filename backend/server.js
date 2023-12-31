const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require('cors');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const list = require('./routes/api/list')
const upload = require('./routes/api/upload')
const board = require('./routes/api/boards')
const notify = require('./routes/api/notify')
const app = express();

dotenv.config()
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }))
app.use('/images', express.static(__dirname + '/images'));

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err));

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/list', list);
app.use('/api/upload', upload);
app.use('/api/boards', board);
app.use('/api/notify', notify);
const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
