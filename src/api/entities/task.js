import AWS from 'aws-sdk';

import { DynamoAction } from './helpers/helper';

const documentClient = new AWS.DynamoDB.DocumentClient({ service: new AWS.DynamoDB() });

export const get = async taskId => {
  //get
  try {
    const param = {
      Key: { id: taskId },
      TableName: `${process.env.TODOLIST_TASK_TABLE}-${process.env.TODOLIST_STAGE}`
    };

    const data = await DynamoAction.get(documentClient, param);

    return data.Item;
  } catch (error) {
    throw error;
  }
};

export const update = (taskId, data, updateCondition) => {
  return new Promise((resolve, reject) => {
    try {
      const itemData = { ...data, createDate: Date.now() };
      const aValues = {};
      const aNames = {};
      let updateExpression = '';
      for (const i in data) {
        aValues[`:${i}`] = data[i];
        aNames[`#${i}`] = i;
        if (updateExpression) updateExpression += ', ';
        updateExpression += `#${i} = :${i}`;
      }

      let updateConditionExpression = '';
      for (const i in updateCondition) {
        aValues[`:cond${i}`] = updateCondition[i];
        updateConditionExpression += ` AND #${i} = :cond${i}`;
      }

      //update
      const task = documentClient.update(
        {
          Key: { id: taskId },
          TableName: `${process.env.TODOLIST_TASK_TABLE}-${process.env.TODOLIST_STAGE}`,
          UpdateExpression: 'set ' + updateExpression,
          ExpressionAttributeNames: aNames,
          ExpressionAttributeValues: aValues,
          ConditionExpression: 'attribute_exists(id)' + updateConditionExpression
        },
        (err, data) => {
          if (err) return console.log('Update task failed: ', err), reject(err);

          console.log('Task update result: ', data);

          resolve();
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

