import React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const alt = "Frame Image";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const revalidate = 0; // Set to 0 to generate a new image for each request

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col items-center justify-center relative bg-black"
        style={{
          backgroundColor: "#000000",
        }}
      >
        {/* Main Content */}
        <div tw="flex flex-col items-center justify-center">
          <h1 tw="text-white font-bold text-6xl mb-4">NFL Boxes Onchain</h1>
          <div tw="text-white text-2xl">Play NFL Boxes Onchain</div>
        </div>

        {/* Optional: Add dynamic data display */}
        <div tw="absolute bottom-10 left-10 text-white text-xl">
          Generated at: {new Date().toISOString()}
        </div>
      </div>
    ),
    {
      ...size,
      // Optional: Add custom fonts
      fonts: [
        {
          name: 'Inter',
          data: await fetch(
            'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
} 