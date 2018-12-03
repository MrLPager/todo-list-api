import {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../entities/task';

exports.createTask = async (req, res) => {
  try {
    const result = await createTask(req.body);
    res.json(result);
  } catch (err) {
    res.json({ error: err });
  }
};

exports.getTask = async (req, res) => {
  try {
    const result = await getTask(req.params.taskId);
    res.json(result);
  } catch (err) {
    res.json({ error: err });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const result = await getTasks();
    res.json(result);
  } catch (err) {
    res.json({ error: err });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const result = await updateTask(req.params.taskId, req.body);
    res.json(result);
  } catch (err) {
    res.json({ error: err });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await deleteTask(req.params.taskId);
    res.json(result);
  } catch (err) {
    res.json({ error: err });
  }
};
