import { useRouter } from 'next/router';
import { APP_URL } from '~/constants';
import Head from 'next/head';
import { useEffect } from 'react';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    if (process.env.NEXT_PUBLIC_VERCEL_URL.startsWith('http')) {
      return process.env.NEXT_PUBLIC_VERCEL_URL;
    }
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return APP_URL;
};

export default function FrameMetadata() {
  const router = useRouter();
  const baseUrl = getBaseUrl();
  const currentPageUrl = `${baseUrl.replace(/\/$/, '')}${router.asPath}`;
  
  useEffect(() => {
    console.log('FrameMetadata rendered:', { currentPageUrl, baseUrl });
  }, [currentPageUrl, baseUrl]);

  const frameEmbedMetadata = {
    version: "next",
    imageUrl: `${baseUrl}/images/logo.png`,
    button: {
      title: "Play NFL Boxes",
      action: {
        type: 'launch',
        name: 'NFL Boxes',
        url: currentPageUrl,
        splashImageUrl: `${baseUrl}/images/icon.png`,
        splashBackgroundColor: '#fafafa',
      }
    }
  }

  return (
    <Head>
      <meta name="fc:frame" content={JSON.stringify(frameEmbedMetadata)} />
    </Head>
  );
} 