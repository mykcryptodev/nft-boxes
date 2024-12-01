import { type GetServerSideProps, type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { APP_URL } from "~/constants";

const Contest = dynamic(() => import("~/components/Contest"), { ssr: false });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  
  // Set cache-control headers for revalidation
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=1, stale-while-revalidate=59'
  );

  // Pre-compute the frame metadata during SSR
  const frameMetadata = {
    version: "vNext",
    imageUrl: `${APP_URL}/images/footballs.jpg`,
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

  return {
    props: {
      contestId: id,
      frameMetadata: frameMetadata,
    },
  };
};

type Props = {
  contestId: string;
  frameMetadata: Record<string, any>;
}

const ContestPage: NextPage<Props> = ({ contestId, frameMetadata }) => {
  return (
    <>
      <Head>
        <meta name="fc:frame" content={JSON.stringify(frameMetadata)} />
      </Head>
      <Contest contestId={contestId} />
    </>
  )
}

export default ContestPage;
