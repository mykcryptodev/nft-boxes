import { type FC } from "react";

import { type Contest } from "~/types/contest";

interface Props {
  contest: Contest;
}

export const Players: FC<Props> = ({ contest }) => {
  return <div>Players</div>;
};
