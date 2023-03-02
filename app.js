//jshint esversion:6
require('dotenv').config()

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");
////////////////////////////////////////////*Starting line of code*////////////////////////////////////////////////////////////////////////////////
const app = express();
console.log(process.env.API_KEY);
// Set up static directory for serving files
app.use(express.static("public"));

// Set up view engine
app.set('view engine', 'ejs');

// Set up body-parser middleware
app.use(bodyParser.urlencoded({extended:true}));
/////////////////////////////////////////*Mongoose files*//////////////////////////////////////////////////////////////////////////////////
// to connect mongoose
mongoose.connect('mongodb://0.0.0.0:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true

}).then(() => {
  console.log('MongoDB connected successfully!');
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err.message);
});
// to create a user schema

const userSchema = new mongoose.Schema({
  username: String,
  email:  String,
  password: String
  
});
// need to creat the encrypt before making the user model
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password'] } );
// to create a user model
const User = mongoose.model('User', userSchema);

/////////////////////////////////////////*Javascript files*///////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.render("home");
   
  });
  app.get('/login', (req, res) => {
    res.render("login");
  });

  app.get('/register', (req, res) => {
    res.render("register");
  });
  
  app.post('/register', async (req, res) => {
    const newUser = new User({
      username: req.body.usingId,
      email: req.body.username,
      password: req.body.password
    });
  
    try {
      await newUser.save();
      res.render("secrets");
    } catch (err) {
      res.status(404).send("There has been an error: " + err.message);
    }
  });

  app.post('/login', (req, res) => {
    const userName = req.body.usingId;
    const password = req.body.password;
    User.findOne({ username: userName })
      .then((foundUser) => {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          } else {
            res.send("Invalid password");
          }
        } else {
          res.send("User not found");
        }
      })
      .catch((err) => {
        res.status(404).send("There has been an error: " + err.message);
      });
  });
  
  
  



// Start server listening on a port
app.listen(4000, () => {
  console.log("Server started on port 3000");
});
