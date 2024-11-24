import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

type Props = {
  onSetIdentity: () => void;
}
export const IdentityOptions: FC<Props> = ({ onSetIdentity }) => {
  return (
    <>
      <h3 className="text-2xl font-bold">Let players know who you are!</h3>
      <p className="py-4">You are currently playing anonymously. Help others recognize you by setting up an identity.</p>
      <div className={`h-full w-full rounded-lg flex items-center justify-center relative px-0.5 py-0.5 bg-gradient-to-b from-primary to-secondary`}>
        <div className="bg-base-100 p-4 h-full w-full flex flex-col items-center justify-center rounded-[calc(0.5rem-1px)]">
          <Image src="/images/basename.png" alt="Basename" width={42} height={42} />
          <h4 className="text-lg font-bold flex items-center gap-2 mt-2">
            Get a Basename
          </h4>
          <p className="py-4 text-center">Basenames are a way of identifying yourself across many apps. Set it once, use it everywhere!</p>
          <div className="flex justify-center">
            <Link href="https://base.org/names" target="_blank" rel="noreferrer" className="btn btn-primary">
              Get a Basename
              <ArrowTopRightOnSquareIcon className="w-4 h-4 stroke-2" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4 text-center mt-4">
        <h4 className="text-lg font-bold">Set a username &amp; avatar</h4>
        <p className="py-4">Your username &amp; avatar will only work on this site.</p>
        <div className="flex justify-center">
          <button className="btn" onClick={onSetIdentity}>Set username &amp; avatar</button>
        </div>
      </div>
    </>
  )
}

export default IdentityOptions;