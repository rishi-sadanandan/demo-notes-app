import Stripe from "stripe";
import handler from "../util/handler";
import { calculateCost } from "../util/cost";

export const main = handler(async (event) => {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  // load secret key from the environment variables
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return { status: true };
});

// npx aws-api-gateway-cli-test \
// --username='admin@example.com' \
// --password='Passw0rd!' \
// --user-pool-id='us-east-1_dFYQteUEk' \
// --app-client-id='278uhcroi2lcv23r2r72rmusl3' \
// --cognito-region='us-east-1' \
// --identity-pool-id='us-east-1:5073edc8-ae72-4cb8-a3d5-3c1da57b62c4' \
// --invoke-url='https://5ho7687cej.execute-api.us-east-1.amazonaws.com' \
// --api-gateway-region='us-east-1' \
// --path-template='/billing' \
// --method='POST' \
// --body='{"source":"tok_visa","storage":21}'
