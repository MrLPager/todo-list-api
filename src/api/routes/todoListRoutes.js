'use strict';
import todoList from '../controllers/todoListController';

module.exports = app => {  
  // todoList Routes
  app.route("/tasks")
     .get(todoList.getTasks)
     .post(todoList.createTask);

  app.route("/tasks/:taskId")
     .get(todoList.getTask)
     .post(todoList.updateTask)
     .delete(todoList.deleteTask);
};