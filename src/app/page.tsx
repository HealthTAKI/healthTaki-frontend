"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { BalanceOverview } from "@/components/dashboard/balance-overview";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { ReceivePanel } from "@/components/dashboard/receive-panel";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { useWallet } from "@/context/wallet-context";

export default function Home() {
  const { address, status, error } = useWallet();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {!address ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <h1 className="font-heading text-2xl font-semibold">
              Connect your wallet to view your payment dashboard
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              HealthTaki uses your Stellar wallet to show patient payments received
              directly on-chain — no intermediary custody of your funds.
            </p>
            <ConnectWalletButton />
            {status === "error" && error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <BalanceOverview />
            <div className="grid gap-6 lg:grid-cols-2">
              <ReceivePanel />
              <RecentPayments />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
