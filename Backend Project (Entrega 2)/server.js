require('dotenv').config();

const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT;

// User Controllers

const {
  newUser,
  getUser,
  editUser,
  checkEmail,
  getUserName,
  getLanguages,
  loginUser,
  updatePasswordUser,
  validateUser,
  deleteUser
} = require('./controllers/users');

// Entry Controllers
const {
  listEntries,
  newEntry,
  joinEntry,
  allowJoin,
  getEntry,
  getPeopleInAMeeting,
  getAllPeopleInAMeeting,
  getMyMeetings,
  getMyMeetingsHosted,
  deleteEntry,
  editEntry,
  voteEntry,
  getEntryVotes
} = require('./controllers/meetings');

// Auth middlewares
const { userIsAuthenticated } = require('./middlewares/auth');

// Console logger middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(bodyParser.json());

// Multipart parsing middleware
app.use(fileUpload());

// CORS middleware
app.use(cors());

// Serve static
app.use(express.static(path.join(__dirname, 'static')));

// User Routes
app.post('/users', newUser); //Create a new user
app.post('/users/login', loginUser); //Login with your user with a json with this keys: email, user_password
app.post('/email', checkEmail); //Checks if an email already exists
app.get('/users/validate', validateUser); //Validate your email by clicking the link received in your mail
app.get('/userName', getUserName); //Gets an username with an id input
app.get('/languages', getLanguages); //Gets all languages in an array
app.post('/users/:id/password', userIsAuthenticated, updatePasswordUser); //Changes password
app.get('/users/:id', userIsAuthenticated, getUser); //Gets info about an user
app.put('/users/:id', userIsAuthenticated, editUser); //Edits your user
app.delete('/users/:id', userIsAuthenticated, deleteUser); // "deletes" (hide) an user (only if you are this user or an admin)

// Diary Routes
app.get('/entries', listEntries); //Searchs and list meetings
app.get('/entries/:id', getEntry); //Gets one meeting
app.post('/entries', userIsAuthenticated, newEntry); // Creates a new meeting
app.post('/entries/join/:id', userIsAuthenticated, joinEntry); // A user joins a meeting (only if they didnt created it)
app.get('/entries/join/:id', userIsAuthenticated, getPeopleInAMeeting); // Gets how much people is on the meeting
app.get('/entries/allJoins/:id', userIsAuthenticated, getAllPeopleInAMeeting); // Gets how much people is on the meeting
app.get('/entries/myMeetings/:id', userIsAuthenticated, getMyMeetings); // Gets my Meetings
app.get('/entries/myMeetingsHosted/:id', userIsAuthenticated, getMyMeetingsHosted); // Gets my Meetings Hosted
app.put('/entries/join/:id', userIsAuthenticated, allowJoin); // The host allows users to join his meeting
app.get('/entries/:id/votes', getEntryVotes); // Get rating of a meeting
app.post('/entries/:id/votes', userIsAuthenticated, voteEntry); // Vote a meeting (Only if you joinned it)
app.put('/entries/:id', userIsAuthenticated, editEntry); // Edit meeting (Only host_user or admin)
app.delete('/entries/:id', userIsAuthenticated, deleteEntry); // "deletes" (hide) an entrie (only user that created the post or an admin)

// Error middleware
app.use((error, req, res, next) => {
  // console.error(error);
  res.status(error.httpCode || 500).send({
    status: 'error',
    message: error.message
  });
});

// Not found middleware
app.use((req, res) => {
  res.status(404).send({ status: 'error', message: 'Not found' });
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port} 🚀`);
});
