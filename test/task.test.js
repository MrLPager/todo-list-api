import AWS from 'aws-sdk';
import { createTask, getTask, updateTask } from '../src/api/entities/task';
import config from '../config';

/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

const dynamodb = new AWS.DynamoDB();

beforeAll(async (done) => {
  if (process.env.TODOLIST_STAGE === 'test') {
    process.env.TODOLIST_TASK_TABLE = config.get('toDoListTableName', process.env.TODOLIST_STAGE);
    const params = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}-${
        process.env.TODOLIST_STAGE
      }`,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };

    dynamodb.createTable(params, (err, data) => {
      if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
      }
      if (data) {
        dynamodb.waitFor('tableExists', {
          TableName: `${process.env.TODOLIST_TASK_TABLE}-${
            process.env.TODOLIST_STAGE
          }`,
        }, (e, d) => {
          if (e) console.log(e, e.stack);
          if (d) {
            console.log(d);
            done();
          }
        });
      }
    });
  } else {
    console.log(
      "tried to run tests without TODOLIST_STAGE=test, which is dangerous for your DB's health!",
    );
  }
}, 30000);

afterAll(() => {
  dynamodb.deleteTable({
    TableName: `${process.env.TODOLIST_TASK_TABLE}-${
      process.env.TODOLIST_STAGE
    }`,
  }, (error, data) => {
    if (error) console.error('Unable to delete table. Error JSON:', JSON.stringify(error, null, 2));
    if (data) console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
  });
});

describe('Todo List', () => {
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
      expect.assertions(1);
      const data = {
        name: 'Title',
        description: 'Description',
      };
      const task = await createTask(data);
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
      expect.assertions(1);
      const data = {
        name: 'Title',
        description: 'Description',
      };
      const task = await createTask(data);
      const updateData = {
        name: 'Test Title',
        description: 'Test Description',
      };
      const resoult = await updateTask(task.id, updateData);
      expect(resoult).toEqual({});
    });
  });
});
