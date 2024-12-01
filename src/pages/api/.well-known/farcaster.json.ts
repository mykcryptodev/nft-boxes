import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const getBaseUrl = () => {
    return "https://superbowl-onchain.vercel.app";
  };

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIxNzI0OCwidHlwZSI6ImN1c3RvZHkiLCJzaWduZXIiOiIweGViYTc4NzE3YjZmMDU5Y2ZlMGI3NWU3NWMyZWQ0YmI3Y2E2NTE1NGYifQ",
      payload: "eyJkb21haW4iOiJzdXBlcmJvd2wtb25jaGFpbi52ZXJjZWwuYXBwIn0",
      signature: "MHg5YWFhMzM1ZmUxM2FhYjdjYmU3ODg4NzE2NTY5NDNiNGU2MTljYWNkZmM1MGEyYjZmMWI4MzM0NWU3ZDBmYmM2MTMwYTc5NGZmNzY3Y2ZiOTQ1NTVhYWQzZjJhMzU0ZDcxMjE1Yjk5YjI4ZTY2Y2UxMGY3NjEwOTAyYWQ4YmRiMzFj",
    },
    frame: {
      version: "0.0.0",
      name: "NFL Boxes",
      iconUrl: `${getBaseUrl()}/images/icon.png`,
      splashImageUrl: `${getBaseUrl()}/images/logo.png`,
      splashBackgroundColor: "#fafafa",
    },
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(config);
}