import { Html, Head, Main, NextScript } from 'next/document'
import { DocumentContext, DocumentInitialProps } from 'next/document'

interface DocumentProps extends DocumentInitialProps {
  frameMetadata?: string;
}

export default function Document({ frameMetadata }: DocumentProps) {
  return (
    <Html>
      <Head>
        {frameMetadata && (
          <meta name="fc:frame" content={frameMetadata} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await ctx.defaultGetInitialProps(ctx)
  // @ts-ignore
  const frameMetadata = (ctx.req as any).frameMetadata

  return {
    ...initialProps,
    frameMetadata
  }
}