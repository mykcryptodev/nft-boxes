import { type NextPage } from "next";

import ContestForm from "~/components/Contest/Form";

export const CreateContest: NextPage = () => {
  return (
    <div>
        Creating Contest...
        <ContestForm />
    </div>
  )
}

export default CreateContest;