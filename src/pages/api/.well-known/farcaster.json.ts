import { type NextApiRequest, type NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIxNzI0OCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGViYTc4NzE3YjZmMDU5Y2ZlMGI3NWU3NWMyZWQ0YmI3Y2E2NTE1NGYifQ==",
      payload: "eyJkb21haW4iOiJzdXBlcmJvd2wtb25jaGFpbi1naXQtZnJhbWVzLXYyLW15a2NyeXB0b2RldnMtcHJvamVjdHMudmVyY2VsLmFwcCJ9",
      signature:
        "0x281f897d272c5dbc2e18385232a9f4c4de14bf7ac6c809d2d5ebad17de9d497861eee63aefa1a9bdf537f17a280a37e1825cf8f6cd0326baa6ea2d6f874ef66a1b",
    },
    frame: {
      version: "vNext",
      name: "NFL Boxes",
      iconUrl: `${appUrl}/images/icon.png`,
      splashImageUrl: `${appUrl}/images/logo.png`,
      splashBackgroundColor: "#fafafa",
      homeUrl: appUrl,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(config);
}