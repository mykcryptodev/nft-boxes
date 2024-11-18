import Head from "next/head";
import Link from "next/link";
import { useAccount } from "wagmi";

import { Wallet } from "~/components/Wallet";
import { APP_DESCRIPTION, APP_NAME } from "~/constants";

export default function Home() {
  const { address } = useAccount();
  
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-center">
            {APP_NAME}
          </h1>
          {!address && (
            <Wallet btnLabel="Connect Wallet To Play" />
          )}
          {address && (
            <Link href="/contest/create" className="btn btn-lg btn-primary">
              Create Contest
            </Link>
          )}
        </div>
      </main>
    </>
  );
}