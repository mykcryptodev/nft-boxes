import { type NextApiRequest, type NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // const appUrl = process.env.NEXT_PUBLIC_URL;
  const getBaseUrl = () => {
    // if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    //   if (process.env.NEXT_PUBLIC_VERCEL_URL.startsWith('http')) {
    //     return process.env.NEXT_PUBLIC_VERCEL_URL;
    //   }
    //   return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    // }
    // return appUrl;
    return "https://superbowl-onchain-git-frames-v2-mykcryptodevs-projects.vercel.app"
  };

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIxNzI0OCwidHlwZSI6ImN1c3RvZHkiLCJzaWduZXIiOiIweGViYTc4NzE3YjZmMDU5Y2ZlMGI3NWU3NWMyZWQ0YmI3Y2E2NTE1NGYifQ",
      payload: "eyJkb21haW4iOiJzdXBlcmJvd2wtb25jaGFpbi1naXQtZnJhbWVzLXYyLW15a2NyeXB0b2RldnMtcHJvamVjdHMudmVyY2VsLmFwcCJ9",
      signature: "MHhiZDAyZTU2YmEzMmM3NWU1Mzk1OGIxMjg1ZTIyMDdlMzE0ZDM4MTYxN2IyMWZjYjAyMjY2MTcxYzBiMDdkNjNmNDEwODRlYmMzOTk3YzhmZjExZDJiOGIzOWY5NGYxM2M5NjViZDZkNDZiYjAyMjBkNjVmNTI2NWY3MGFlMWVlZDFj",
    },
    frame: {
      version: "0.0.0",
      name: "NFL Boxes",
      iconUrl: `${getBaseUrl()}/images/icon.png`,
      splashImageUrl: `${getBaseUrl()}/images/logo.png`,
      splashBackgroundColor: "#fafafa",
      homeUrl: getBaseUrl(),
    },
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(config);
}