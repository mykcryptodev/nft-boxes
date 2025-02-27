import { type IncomingMessage } from 'http';
import { type GetServerSideProps } from 'next'

import Contest from '~/components/Contest';
import { APP_URL } from '~/constants'

type ExtendedRequest = IncomingMessage & {
  cookies: Record<string, string | undefined>;
  frameMetadata?: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  
  if (typeof id !== 'string') {
    return { notFound: true };
  }

  // Generate the frame metadata
  const frameMetadata = JSON.stringify({
    version: "next",
    imageUrl: `${APP_URL}/api/frame/image`,
    button: {
      title: "Play NFL Boxes",
      action: {
        type: 'launch_frame',
        name: 'NFL Boxes',
        url: `${APP_URL}/contest/${id}`,
        splashImageUrl: `${APP_URL}/images/icon.png`,
        splashBackgroundColor: '#fafafa',
      }
    }
  });

  // Attach the frame metadata to the request object
  if (context.req) {
    (context.req as ExtendedRequest).frameMetadata = frameMetadata;
  }

  return {
    props: {
      contestId: id,
    }
  }
}

interface PageProps {
  contestId: string;
}

export default function ContestPage({ contestId }: PageProps) {
  return <Contest contestId={contestId} />
}
