import AWS from 'aws-sdk';
import uuid from 'uuid/v1';
import { DynamoAction } from './helpers';
import config from '../../../config';

const documentClient = new AWS.DynamoDB.DocumentClient({
  service: (process.env.TODOLIST_STAGE !== 'prod') ? new AWS.DynamoDB({
    endpoint: config.get('endpoint', process.env.TODOLIST_STAGE),
    region: config.get('region', process.env.TODOLIST_STAGE),
  }) : new AWS.DynamoDB(),
});

export const deleteItem = async (id) => {
  try {
    const param = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}`,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    };

    const res = await DynamoAction.delete(documentClient, param);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateItem = async (id, data, updateCondition) => {
  try {
    const aValues = {};
    const aNames = {};

    let updateExpression = '';
    Object.keys(data).forEach((i) => {
      aValues[`:${i}`] = data[i];
      aNames[`#${i}`] = i;
      if (updateExpression) updateExpression += ', ';
      updateExpression += `#${i} = :${i}`;
    });

    let updateConditionExpression = '';
    if (updateCondition) {
      Object.keys(updateCondition).forEach((i) => {
        aValues[`:cond${i}`] = updateCondition[i];
        updateConditionExpression += ` AND #${i} = :cond${i}`;
      });
    }

    const param = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}`,
      Key: { id },
      UpdateExpression: `set ${updateExpression}`,
      ExpressionAttributeNames: aNames,
      ExpressionAttributeValues: aValues,
      ConditionExpression: `attribute_exists(id)${updateConditionExpression}`,
    };

    const res = await DynamoAction.update(documentClient, param);
    return res;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const itemData = {
      ...taskData,
      id: uuid(),
      status: 'pending',
      createDate: Date.now(),
      updateDate: Date.now(),
    };
    const params = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}`,
      Item: itemData,
    };

    const data = await DynamoAction.put(documentClient, params);
    return data && itemData;
  } catch (error) {
    throw error;
  }
};

export const getTask = async (taskId) => {
  try {
    const param = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}`,
      Key: { id: taskId },
    };

    const data = await DynamoAction.get(documentClient, param);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTasks = async () => {
  try {
    const param = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}`,
    };
    const data = await DynamoAction.scan(documentClient, param);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (taskId, updateData) => {
  try {
    const data = await updateItem(taskId, {
      ...updateData,
      updateDate: Date.now(),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const data = await deleteItem(taskId);
    return data;
  } catch (error) {
    throw error;
  }
};
