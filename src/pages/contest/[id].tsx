import { type GetServerSideProps, type NextPage } from "next";
import dynamic from "next/dynamic";
import { APP_URL } from "~/constants";

const Contest = dynamic(() => import("~/components/Contest"), { ssr: false });

interface FrameMetadata {
  version: string;
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: string;
      name: string;
      url: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
    };
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  
  if (typeof id !== 'string') {
    return {
      notFound: true
    };
  }
  
  // Set cache-control headers for revalidation
  context.res.setHeader(
    'Cache-Control',
    'no-store'
  );

  // Pre-compute the frame metadata during SSR
  const frameMetadata: FrameMetadata = {
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
  };

  context.res.setHeader('Content-Type', 'text/html');
  context.res.write(`
    <head>
      <meta name="fc:frame" content='${JSON.stringify(frameMetadata)}' />
    </head>
  `);

  return {
    props: {
      contestId: id,
      frameMetadata: frameMetadata,
    },
  };
};

type Props = {
  contestId: string;
  frameMetadata: FrameMetadata;
}

const ContestPage: NextPage<Props> = ({ contestId, frameMetadata }) => {
  return (
    <Contest contestId={contestId} />
  )
}

export default ContestPage;
