import AWS from "aws-sdk";
import { DynamoAction } from "./helpers";
import { exists } from "fs";

const uuid = require("uuid/v1");

const documentClient = new AWS.DynamoDB.DocumentClient({
  service: new AWS.DynamoDB()
});

export const createNewTask = async taskData => {
    try {
      const itemData = {
        ...taskData,
        id: uuid(),
        status: "pending",
        createDate: Date.now(),
        updateDate: Date.now()
      };
      const params = {
        TableName: `${process.env.TODOLIST_TASK_TABLE}-${
          process.env.TODOLIST_STAGE
        }`,
        Item: itemData
      };

      const data = await DynamoAction.put(documentClient, params);
      return data && itemData;
    } catch (error) {
      throw error;
    }
};

export const getTaskById = async taskId => {
  try {
    const param = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}-${
        process.env.TODOLIST_STAGE
      }`,
      Key: { id: taskId }
    };

    const data = await DynamoAction.get(documentClient, param);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllTasks = async () => {
  try {
    const param = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}-${
        process.env.TODOLIST_STAGE
      }`
    };
    const data = await DynamoAction.scan(documentClient, param);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (taskId, updateData, updateCondition) => {
  try {
    
    const aValues = {};
    const aNames = {};
    let updateExpression = '';
    for (const i in updateData) {
      aValues[`:${i}`] = updateData[i];
      aNames[`#${i}`] = i;
      if (updateExpression) updateExpression += ', ';
      updateExpression += `#${i} = :${i}`;
    }

    let updateConditionExpression = '';
    for (const i in updateCondition) {
      aValues[`:cond${i}`] = updateCondition[i];
      updateConditionExpression += ` AND #${i} = :cond${i}`;
    }

    const param = {
      TableName: `${process.env.TODOLIST_TASK_TABLE}-${
        process.env.TODOLIST_STAGE
      }`,
      Key: { id: taskId },
      UpdateExpression: 'set ' + updateExpression,
      ExpressionAttributeNames: aNames,
      ExpressionAttributeValues: aValues,
      ConditionExpression: 'attribute_exists(id)' + updateConditionExpression
    };
    const data = await DynamoAction.update(documentClient, param);
    return data;
  } catch (error) {
    throw error;
  }
};