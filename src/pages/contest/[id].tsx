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
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  return {
    props: {
      contestId: id,
    },
  };
};

type Props = {
  contestId: string;
}
const ContestPage: NextPage<Props> = ({ contestId }) => {
  const frameEmbedMetadata = {
    version: "next",
    imageUrl: `${APP_URL}/images/footballs.jpg`,
    button: {
      title: "Play NFL Boxes",
      action: {
        type: 'launch_frame',
        name: 'NFL Boxes',
        url: `${APP_URL}/contest/${contestId}`,
        splashImageUrl: `${APP_URL}/images/icon.png`,
        splashBackgroundColor: '#fafafa',
      }
    }
  }
  return (
    <>
      <Head>
        <meta name="fc:frame" content={JSON.stringify(frameEmbedMetadata)} />
      </Head>
      <Contest contestId={contestId} />
    </>
  )
}

export default ContestPage;
