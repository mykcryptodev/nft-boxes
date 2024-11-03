import type { FC } from "react";
type GameProps = {
  contestId: string;
};
const Contest: FC<GameProps> = ({ contestId }) => {

  return (
    <div>
      Contest {contestId}
    </div>
  );
};

export default Contest;
