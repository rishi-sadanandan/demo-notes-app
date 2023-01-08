import handler from "../util/handler";
import * as uuid from "uuid";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  // request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME, // set up when congifuring ApiStack
    Item: {
      // attributes of the item to be created
      userId: "123",
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
