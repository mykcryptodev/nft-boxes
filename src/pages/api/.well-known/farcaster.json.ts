import { type NextApiRequest, type NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIxNzI0OCwidHlwZSI6ImN1c3RvZHkiLCJzaWduZXIiOiIweGViYTc4NzE3YjZmMDU5Y2ZlMGI3NWU3NWMyZWQ0YmI3Y2E2NTE1NGYifQ",
      payload: "eyJkb21haW4iOiJzdXBlcmJvd2wtb25jaGFpbi1naXQtZnJhbWVzLXYyLW15a2NyeXB0b2RldnMtcHJvamVjdHMudmVyY2VsLmFwcCJ9",
      signature: "MHhiZDAyZTU2YmEzMmM3NWU1Mzk1OGIxMjg1ZTIyMDdlMzE0ZDM4MTYxN2IyMWZjYjAyMjY2MTcxYzBiMDdkNjNmNDEwODRlYmMzOTk3YzhmZjExZDJiOGIzOWY5NGYxM2M5NjViZDZkNDZiYjAyMjBkNjVmNTI2NWY3MGFlMWVlZDFj",
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