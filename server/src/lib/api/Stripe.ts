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
};
