import {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteItem,
} from '../src/api/entities/task';
import config from '../config';

/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

beforeAll(() => {
  if (process.env.TODOLIST_STAGE === 'test') {
    process.env.TODOLIST_TASK_TABLE = config.get('toDoListTableName', process.env.TODOLIST_STAGE);
  } else {
    console.log(
      "tried to run tests without TODOLIST_STAGE=test, which is dangerous for your DB's health!",
    );
    process.exit(1);
  }
});

describe('Todo List API Test', () => {
  describe('CRUD Task', () => {
    test('Create Task', async () => {
      expect.assertions(1);
      const data = {
        name: 'Title',
        description: 'Description',
      };
      const task = await createTask(data);
      expect(task).toEqual({ ...task, name: data.name, description: data.description });
    });

    test('Get Task By ID', async () => {
      expect.assertions(2);
      const data = {
        name: 'Title',
        description: 'Description',
      };
      const task = await createTask(data);
      expect(task).toEqual({ ...task, name: data.name, description: data.description });
      const theTask = await getTask(task.id);
      expect(theTask).toEqual({
        Item: {
          updateDate: expect.any(Number),
          createDate: expect.any(Number),
          description: expect.any(String),
          id: expect.any(String),
          name: expect.any(String),
          status: 'pending',
        },
      });
    });

    test('Update Task By ID', async () => {
      expect.assertions(2);
      const data = {
        name: 'Title',
        description: 'Description',
      };
      const task = await createTask(data);
      expect(task).toEqual({ ...task, name: data.name, description: data.description });
      const updateData = {
        name: 'Test Title',
        description: 'Test Description',
      };
      const result = await updateTask(task.id, updateData);
      expect(result).toEqual({});
    });

    test('Delete Task By ID', async () => {
      expect.assertions(2);
      const data = {
        name: 'Title',
        description: 'Description',
      };
      const task = await createTask(data);
      expect(task).toEqual({ ...task, name: data.name, description: data.description });
      const result = await deleteItem(task.id);
      expect(result).toEqual({});
    });

    test('Get Tasks', async () => {
      expect.assertions(2);
      const data = {
        name: 'Title',
        description: 'Description',
      };
      const task = await createTask(data);
      expect(task).toEqual({ ...task, name: data.name, description: data.description });
      const result = await getTasks();
      expect(result).toEqual({
        Items: expect.any(Array),
        Count: expect.any(Number),
        ScannedCount: expect.any(Number),
      });
    });
  });
});
