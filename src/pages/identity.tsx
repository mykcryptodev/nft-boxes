import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { type FC,useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { Wallet } from "~/components/Wallet";
import { api } from "~/utils/api";

const IdentityForm = dynamic(() => import("~/components/Identity/Form"), { ssr: false });

const IdentityPage: FC = () => {
  const { data: session} = useSession();
  const { address } = useAccount();
  const router = useRouter();
  const { contestId, returnUrl } = router.query;
  const { refetch } = api.contest.getCached.useQuery(
    { contestId: contestId as string },
    { enabled: !!contestId }
  );

  const handleBack = () => {
    if (returnUrl) {
      void router.push(returnUrl as string);
    } else {
      void router.back();
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={handleBack}
          className="btn btn-ghost mb-8 gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Game
        </button>
        
        <div className="card bg-base-200">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-8">Update Your Profile</h1>
            {address ? (
              <IdentityForm 
              onIdentitySet={() => {
                void refetch();
                handleBack();
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Wallet />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityPage; 