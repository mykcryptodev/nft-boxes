import Head from 'next/head'

interface FrameMetadataProps {
  metadata: string
}

export function FrameMetadata({ metadata }: FrameMetadataProps) {
  return (
    <Head>
      <meta name="fc:frame" content={metadata} />
    </Head>
  )
} 