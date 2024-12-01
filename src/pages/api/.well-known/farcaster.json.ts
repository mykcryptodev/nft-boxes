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
        "eyJmaWQiOjIxNzI0OCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGViYTc4NzE3YjZmMDU5Y2ZlMGI3NWU3NWMyZWQ0YmI3Y2E2NTE1NGYifQ",
      payload: "eyJkb21haW4iOiJzdXBlcmJvd2wtb25jaGFpbi52ZXJjZWwuYXBwIn0",
      signature: "MHhlOTliY2MxYTE0ZTNhOTVhNWU4MTVjMDM2OWFkNjQxZGU3N2NiZDlmNGYxZGNhYjY4ZjY0ZmE0OGQxN2RmZWNmNmQyMTE0MTc4MDQzN2M0MTI3ZWU3YTNhODMxMThiYjhmMWM0MzdkMWJmODI4ZWM4MzYxODM4OGMzYmM4MmI5MTFj",
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