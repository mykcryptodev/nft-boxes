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
  
  let frameMetadata: string | undefined;
  try {
    // @ts-ignore
    frameMetadata = ctx.req?.frameMetadata;
  } catch (error) {
    // Ignore any errors when accessing frameMetadata
    console.warn('Error accessing frameMetadata:', error);
  }

  return {
    ...initialProps,
    frameMetadata
  }
}