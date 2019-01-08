import AWS from 'aws-sdk';
import bodyParser from 'body-parser';
import express from 'express';
import config from '../config';

/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

const app = express();
const port = process.env.PORT || 3000;

AWS.config.maxRetries = 0;

process.env.TODOLIST_TASK_TABLE = config.get('toDoListTableName', process.env.TODOLIST_STAGE);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require('./api/routes/task');

routes(app);

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

app.listen(port);

console.log(`todo list RESTful API server started on: ${port}`);
