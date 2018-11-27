var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/todoListModel'), //created model loading here
  bodyParser = require('body-parser');

import AWS from 'aws-sdk';
import config from '../config';

AWS.config.maxRetries = 0;

if (process.env.LOCAL === 'true') {
	process.env.TODOLIST_STAGE = 'dev';
	process.env.TODOLIST_TASK_TABLE = config.get('toDoListTableName', process.env.TODOLIST_STAGE);
}

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo:27017/Tododb', { useNewUrlParser: true }); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/todoListRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);