"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import { AccountBalance, fetchAccountBalances, fundTestnetAccount } from "@/lib/stellar/horizon";
import { STELLAR_NETWORK } from "@/lib/stellar/config";
import { toast } from "sonner";

export function BalanceOverview() {
  const { address } = useWallet();
  const [balances, setBalances] = useState<AccountBalance[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountMissing, setAccountMissing] = useState(false);
  const [funding, setFunding] = useState(false);

  const loadBalances = async () => {
    if (!address) return;
    setLoading(true);
    setAccountMissing(false);
    try {
      const result = await fetchAccountBalances(address);
      setBalances(result);
    } catch {
      setAccountMissing(true);
      setBalances(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: fetch balances whenever the connected address changes
    loadBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleFund = async () => {
    if (!address) return;
    setFunding(true);
    try {
      await fundTestnetAccount(address);
      toast.success("Testnet account funded");
      await loadBalances();
    } catch {
      toast.error("Could not fund account via Friendbot");
    } finally {
      setFunding(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (accountMissing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account not found on {STELLAR_NETWORK}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            This address has no balances yet. Fund it to activate the account.
          </p>
          {STELLAR_NETWORK === "TESTNET" && (
            <Button onClick={handleFund} disabled={funding}>
              {funding ? "Funding…" : "Fund with Friendbot"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {balances?.map((balance) => (
        <Card key={`${balance.assetCode}-${balance.assetIssuer ?? "native"}`}>
          <CardHeader>
            <CardTitle className="text-muted-foreground">{balance.assetCode}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold">{balance.balance}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
