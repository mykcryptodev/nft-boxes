import { type GetServerSideProps, type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { APP_URL } from "~/constants";

const Contest = dynamic(() => import("~/components/Contest"), { ssr: false });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
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
    imageUrl: `${APP_URL}/images/logo.png`,
    button: {
      title: "Play NFL Boxes",
      action: {
        type: 'launch',
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
