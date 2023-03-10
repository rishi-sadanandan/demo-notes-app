import { StorageStack } from "./StorageStack";
import { Api, use } from "@serverless-stack/resources";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack); // sharing resources between stacks

  // create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
    },
    routes: {
      "POST /notes": "functions/create.main",
      "GET /notes/{id}": "functions/get.main",
      "GET /notes": "functions/list.main",
      "PUT /notes/{id}": "functions/update.main",
      "DELETE /notes/{id}": "functions/delete.main",
      "POST /billing": "functions/billing.main",
    },
  });

  // show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // return the API resource
  return {
    api,
  };
}
