require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const validUrl = require('valid-url');
const mongoose = require('mongoose');
const URL = require('./models/urlModel')

// connect to db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function generateRandomNumber() {
  return Math.floor((Math.random() * 100) + 1);
}

app.post('/api/shorturl', async function (req, res) {
  const url = req.body.url

  if (!validUrl.isWebUri(url)) {
    res.json({ error: 'invalid url' });
  } else {
    try {
      data = await URL.findOne({original_url: url})
      
      if (!data) {
        data = new URL({
          original_url: url,
          short_url: generateRandomNumber(),
        });
        data = await data.save()
      }
      
      res.json({ original_url: data.original_url, short_url: data.short_url });
    } catch (err) {
      res.json({ error: 'invalid url' });
    }
  }
})

app.get('/api/shorturl/:short_url?', async function(req, res) {
  data = await URL.findOne({short_url: req.params.short_url})

  if (!data) {
    res.json({
      "error": "No short URL found for the given input"
    })
    return
  }
  
  res.redirect(data.original_url)
});