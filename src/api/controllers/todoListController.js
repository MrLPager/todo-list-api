import { createNewTask, getTaskById, getAllTasks, updateTask } from "../entities/task.js";

exports.createTask = async (req, res) => {
  try {
    const result = await createNewTask(req.body);
    res.json(result);
  } catch (err) {
    console.log("createTask error: ", err);
  }
};

exports.getTask = async (req, res) => {
  try {
    const result = await getTaskById(req.params.taskId);
    res.json(result);
  } catch (err) {
    console.log("getTask error: ", err);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const result = await getAllTasks();
    res.json(result);
  } catch (err) {
    console.log("getTasks error: ", err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const result = await updateTask(req.params.taskId, req.body);
    res.json(result);
  } catch (err) {
    console.log("updateTask error: ", err);
  }
};
