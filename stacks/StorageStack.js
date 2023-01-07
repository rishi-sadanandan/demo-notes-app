import { Table, Bucket } from "@serverless-stack/resources";

export function StorageStack({ stack, app }) {
  // create the DynamoDB table
  const table = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      noteId: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
  });

  // create the S3 bucket
  const bucket = new Bucket(stack, "Uploads");

  return {
    table,
    bucket,
  };
}
