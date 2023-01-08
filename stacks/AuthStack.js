import * as iam from "aws-cdk-lib/aws-iam";
import { Cognito, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);

  // create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  // aws cdk code
  auth.attachPermissionsForAuthUsers(stack, [
    api,
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}",
      ],
    }),
  ]);

  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    auth,
  };
}

// npx aws-api-gateway-cli-test --username='admin@example.com' --password='Passw0rd!' \
// --user-pool-id='us-east-1_dFYQteUEk' \
// --app-client-id='278uhcroi2lcv23r2r72rmusl3' \
// --cognito-region='us-east-1' \
// --identity-pool-id='us-east-1:5073edc8-ae72-4cb8-a3d5-3c1da57b62c4' \
// --invoke-url='https://5ho7687cej.execute-api.us-east-1.amazonaws.com' \
// --api-gateway-region='us-east-1' \
// --path-template='/notes' \
// --method='POST' \
// --body='{"content":"hello world","attachment":"hello.jpg"}'
