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

export default async function Image() {
  try {
    const response = new ImageResponse(
      (
        <div
          tw="h-full w-full flex flex-col items-center justify-center relative"
          style={{
            background: "linear-gradient(to bottom, #000000, #1a1a1a)",
          }}
        >
          <div tw="flex flex-col items-center justify-center">
            <h1 tw="text-white font-bold text-6xl mb-4">NFL Boxes Onchain</h1>
            <div tw="text-white text-2xl">Play NFL Boxes Onchain</div>
          </div>
        </div>
      ),
      {
        ...size,
        headers: {
          'content-type': 'image/png',
          'cache-control': 'no-store',
        },
      }
    );

    return response;
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 