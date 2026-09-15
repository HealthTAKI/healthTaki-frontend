"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/context/wallet-context";
import { fetchRecentPayments, IncomingPayment } from "@/lib/stellar/horizon";
import { STELLAR_NETWORK } from "@/lib/stellar/config";

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function explorerUrl(hash: string): string {
  const cluster = STELLAR_NETWORK === "PUBLIC" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${cluster}/tx/${hash}`;
}

export function RecentPayments() {
  const { address } = useWallet();
  const [payments, setPayments] = useState<IncomingPayment[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset loading state when the fetch for a new address starts
    setLoading(true);
    fetchRecentPayments(address)
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [address]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent patient payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {!loading && payments?.length === 0 && (
          <p className="text-sm text-muted-foreground">No incoming payments yet.</p>
        )}

        {!loading &&
          payments?.map((payment) => (
            <a
              key={payment.id}
              href={explorerUrl(payment.transactionHash)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent"
            >
              <span className="text-muted-foreground">
                From {truncateAddress(payment.from)}
              </span>
              <span className="font-medium">
                +{payment.amount} {payment.assetCode}
              </span>
            </a>
          ))}
      </CardContent>
    </Card>
  );
}
