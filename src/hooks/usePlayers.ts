import { api } from "~/utils/api";

export const usePlayers = (contestId: string) => {
  return api.contest.getAllPlayersInContest.useQuery(
    { contestId },
    {
      enabled: !!contestId,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    }
  );
};