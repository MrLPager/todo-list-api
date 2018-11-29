import config from "../../../../config";

export const operation = method => (
  client,
  params,
  maxRetries = config.get("db.operationSettings.maxRetries"),
  timeout = config.get("db.operationSettings.timeout")
) => {
  return new Promise((resolve, reject) => {
    const dbAction = (counter = 0) => {
      return client[method](params, (error, data) => {
        if (
          error &&
          error.code === "ProvisionedThroughputExceededException" &&
          counter < maxRetries
        ) {
          console.log(
            `ProvisionedThroughputExceededException error catched, wait 1 second and try it again`
          );
          return setTimeout(() => dbAction(++counter), timeout);
        }

        if (error && error.code === "ProvisionedThroughputExceededException")
          return reject(`Server is too busy. Try again later.`);
        if (error)
          return console.log("Dynamo scan failed: ", error), reject(error);

        return resolve(data);
      });
    };

    return dbAction();
  });
};

export const DynamoAction = {
  query: operation("query"),
  scan: operation("scan"),
  get: operation("get"),
  update: operation("update"),
  put: operation("put")
};
