/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import config from '../../../../config';

export const operation = method => (
  client,
  params,
  maxRetries = config.get('db.operationSettings.maxRetries'),
  timeout = config.get('db.operationSettings.timeout'),
) => new Promise((resolve, reject) => {
  const dbAction = (counter = 0) => client[method](params, (error, data) => {
    let iCounter = counter;
    if (
      error
          && error.code === 'ProvisionedThroughputExceededException'
          && iCounter < maxRetries
    ) {
      console.log(
        'ProvisionedThroughputExceededException error catched, wait 1 second and try it again',
      );
      iCounter += 1;
      return setTimeout(() => dbAction(iCounter), timeout);
    }

    if (error && error.code === 'ProvisionedThroughputExceededException') {
      console.log('Server is too busy. Try again later: ', error);
      return reject(error);
    }
    if (error) {
      console.log('Dynamo scan failed: ', error);
      return reject(error);
    }

    return resolve(data);
  });

  return dbAction();
});

export const DynamoAction = {
  query: operation('query'),
  scan: operation('scan'),
  get: operation('get'),
  update: operation('update'),
  put: operation('put'),
  delete: operation('delete'),
};
