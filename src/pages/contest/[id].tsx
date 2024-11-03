import { type GetServerSideProps, type NextPage } from "next";

import Contest from "~/components/Contest";

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
  return (
    <div>
      <Contest contestId={contestId} />    
    </div>
  )
}

export default ContestPage;
