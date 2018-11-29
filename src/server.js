import AWS  from 'aws-sdk';
import config from '../config';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

AWS.config.maxRetries = 0;

if (process.env.LOCAL === 'true') {
	process.env.TODOLIST_STAGE = 'dev';
	process.env.TODOLIST_TASK_TABLE = config.get('toDoListTableName', process.env.TODOLIST_STAGE);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/todoListRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);