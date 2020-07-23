import StripeApi from "stripe";

const client = new StripeApi(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2020-03-02",
});

export const Stripe = {
  connect: async (code: string): Promise<StripeApi.OAuthToken> => {
    const response = await client.oauth.token({
      code,
      grant_type: "authorization_code",
    });

    return response;
  },
  charge: async (
    amount: number,
    source: string,
    stripeAccount: string
  ): Promise<void> => {
    const res = await client.charges.create(
      {
        amount,
        currency: "usd",
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripe_account: stripeAccount,
      }
    );

    if (res.status !== "succeeded") {
      throw new Error("Failed to create charge with Stripe!");
    }
  },
};
